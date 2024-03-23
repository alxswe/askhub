/* eslint-disable @next/next/no-img-element */
import LoadingNotification from "@/components/layout/LoadingNotification";
import { formatNumber } from "@/components/utils/renderValue";
import { PlusIcon } from "@heroicons/react/20/solid";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import pluralize from "pluralize";
import { useCallback, useEffect, useMemo, useState } from "react";
import TailwindAlert from "../alert/http";
import { useAxiosResponse } from "../client/hook";
import { FloatingCommunityForm } from "./form";

export interface ICommunity {
  id: string;
  name: string;
  description: string;
  members: String[];
  createdById: string;
  createdBy: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export default function CommunityList() {
  const router = useRouter();
  const { data: session } = useSession();
  const [response, setResponse] = useAxiosResponse();
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [params, setParams] = useState<{ take: number; skip: number }>({
    take: 9,
    skip: 0,
  });

  const fetchCommunities = useCallback(async () => {
    const controller = new AbortController();

    setLoading((_) => true);

    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      // @ts-expect-error:  No index signature with a parameter of type 'string' was found on type '{ take: number; skip: number; }'.ts(7053)
      searchParams.set(key, params[key] as string);
    });

    const res = await fetch(`/api/communities?${searchParams}`, {
      credentials: "include",
      signal: controller.signal,
    });
    if (res.ok) {
      const data = await res.json();
      setCommunities((prev) => {
        if (params.skip === 0) {
          return data;
        } else {
          return [...prev, ...data];
        }
      });
    } else {
      setResponse(res);
    }
    setLoading((_) => false);
    return () => {
      controller.abort();
    };
  }, [params, setResponse]);

  useEffect(() => {
    if (router.isReady) {
      fetchCommunities();
    }
  }, [fetchCommunities, router.isReady]);

  const handleOffset = () => {
    setParams((prev) => ({
      ...prev,
      skip: communities.length + prev.take,
    }));
  };

  const [selector, setSelector] = useState<{
    open: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    element: any;
  }>({
    open: false,
    create: false,
    update: false,
    delete: false,
    element: null,
  });

  const updateCommunityInList = (community: ICommunity) => {
    const results = [...communities];
    const idx = results.findIndex((q) => q.id === community.id);
    results[idx] = community;
    setCommunities((prev) => results);
  };

  const addCommunityToList = (community: ICommunity) => {
    const results = [...communities];
    results.unshift(community);
    setCommunities((prev) => results);
  };

  const hasContent = useMemo(
    () => communities.length > 0,
    [communities.length],
  );

  return (
    <>
      <FloatingCommunityForm
        element={selector.element}
        open={selector.create}
        setOpen={() =>
          setSelector((prev) => ({ ...prev, create: !prev.create }))
        }
        next={(community: ICommunity) => {
          addCommunityToList(community);
          setSelector((prev) => ({ ...prev, create: !prev.create }));
        }}
      />
      <div className="space-y-4">
        <TailwindAlert error={response} />
        <div>
          <div className="flex items-center justify-between border-b border-gray-200 px-4 pb-5 sm:px-0">
            <h1 className="text-lg font-medium text-gray-700">Communities</h1>
            {session?.user?.id && (
              <button
                type="button"
                onClick={() =>
                  setSelector((prev) => ({ ...prev, create: !prev.create }))
                }
                className="bg-indigo-60 inline-flex items-center gap-x-1 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-600 focus:outline-none"
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
          {hasContent ? (
            <>
              <ul
                role="list"
                className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3"
              >
                {communities.map((element, elementIdx) => (
                  <li
                    key={element.id}
                    className="relative flex items-center space-x-3 border border-gray-200 p-4 focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2 hover:border-gray-400 hover:bg-gray-50 lg:rounded-lg"
                  >
                    <div className="flex flex-shrink-0 items-center justify-start gap-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        #{formatNumber(elementIdx + 1)}
                      </span>
                      <svg
                        className="h-10 w-10 rounded-full bg-gray-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806V13.5H5.931V6.172h1.8v.9h.039a3.009 3.009 0 0 1 1.018-.732 3.45 3.45 0 0 1 1.449-.284c.246-.003.491.02.732.068.158.024.309.08.444.164l-.759 1.832a2.09 2.09 0 0 0-1.093-.26c-.33-.01-.658.062-.954.208a1.422 1.422 0 0 0-.591.565Zm2.9 6.918H9.355L14.7 2.633c.426.272.828.58 1.2.922l-4.984 11.996Z"></path>
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={{
                          pathname: "/communities/[id]",
                          query: { id: element.id },
                        }}
                        className="focus:outline-none"
                      >
                        <span
                          className="absolute inset-0"
                          aria-hidden="true"
                        ></span>
                        <p className="text-sm font-medium text-gray-900">
                          {element.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {formatNumber(element.members?.length)}{" "}
                          {pluralize("Member", element.members?.length)}{" "}
                        </p>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleOffset}
                  className="inline-flex w-full items-center justify-center px-3.5 py-3 font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  Load More
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <UserGroupIcon
                className="mx-auto h-12 w-12 text-gray-400"
                aria-hidden="true"
              />

              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No communities
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new community
              </p>
            </div>
          )}
        </div>
      </div>
      <LoadingNotification show={loading} />
    </>
  );
}
