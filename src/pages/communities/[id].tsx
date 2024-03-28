import TailwindAlert from "@/components/alert/http";
import { useAxiosResponse } from "@/components/client/hook";
import LayoutContainer from "@/components/layout/Container";
import { loadCommunity } from "@/components/loaders/loader";
import { QuestionList } from "@/components/question/list";
import { formatNumber } from "@/components/utils/renderValue";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  CogIcon,
  FlagIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import pluralize from "pluralize";
import { useCallback, useMemo, useState } from "react";

interface Props {
  _community: ICommunity;
}

export default function CommunityDetailPage({ _community }: Props) {
  const { data: session } = useSession();

  const params = useParams();
  const [response, setResponse] = useAxiosResponse();
  const [data, setData] = useState<typeof _community>({ ..._community });

  const loadObject = useCallback(async () => {
    const controller = new AbortController();
    const res = await fetch("/api/communities/" + params.id, {
      credentials: "include",
      signal: controller.signal,
    });
    if (res.ok) {
      const dt = await res.json();
      setData(dt);
    } else {
      setResponse(res);
    }
  }, [params.id, setResponse]);

  const handleMembership = async () => {
    let members;
    if (data.members.includes(session?.user.id!)) {
      members = data.members.filter((_id) => _id !== session?.user.id!);
    } else {
      members = [...data.members, session?.user.id];
    }

    const res = await fetch("/api/communities/" + data.id, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        ...data,
        members,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const dt = await res.json();
      setData((prev) => ({ ...prev, ...dt }));
    } else {
      setResponse(res);
    }
  };

  const isMember = useMemo(
    () => data.members?.includes(session?.user?.id!),
    [data.members, session?.user?.id],
  );

  return (
    <LayoutContainer>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 xl:col-span-2">
          <h1 className="sr-only">Community</h1>
          <div className="space-y-6">
            <TailwindAlert error={response} />
            <QuestionList communityId={params.id} />
          </div>
        </div>
        <aside className="relative order-first lg:order-last lg:col-span-1 xl:col-span-1">
          <div className="sticky top-4 space-y-4 bg-gray-50">
            <div className="flex items-center justify-center px-4 py-6 sm:p-6 lg:flex-col lg:space-y-4">
              <svg
                className="h-24 w-24 rounded-full bg-gray-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806V13.5H5.931V6.172h1.8v.9h.039a3.009 3.009 0 0 1 1.018-.732 3.45 3.45 0 0 1 1.449-.284c.246-.003.491.02.732.068.158.024.309.08.444.164l-.759 1.832a2.09 2.09 0 0 0-1.093-.26c-.33-.01-.658.062-.954.208a1.422 1.422 0 0 0-.591.565Zm2.9 6.918H9.355L14.7 2.633c.426.272.828.58 1.2.922l-4.984 11.996Z"></path>
              </svg>
              <div className="ml-4 text-center">
                <p className="text-lg font-semibold text-gray-900">
                  r/{data.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatNumber(data.members.length)}{" "}
                  {pluralize("Member", data.members.length)}
                </p>
              </div>
            </div>
            {session?.user.id && (
              <div className="flex flex-col items-center justify-center space-y-2 bg-gray-100 px-4 py-6 sm:p-6">
                {session?.user?.id && isMember && (
                  <Link
                    href={{
                      pathname: "/questions/ask",
                      query: { communityId: data.id },
                    }}
                    className="inline-flex w-full items-center justify-center rounded-full border border-gray-400 bg-white px-3.5 py-2 text-gray-900 ring-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="ml-2 text-sm font-medium">
                      New Question
                    </span>
                  </Link>
                )}
                {isMember ? (
                  <button
                    type="button"
                    onClick={handleMembership}
                    className="inline-flex w-full items-center justify-center rounded-full border border-rose-400 bg-white px-3.5 py-2 text-rose-900 ring-rose-400 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <ArrowLeftStartOnRectangleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium">
                      Leave Community
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleMembership}
                    className="inline-flex w-full items-center justify-center rounded-full border border-gray-400 bg-white px-3.5 py-2 text-gray-900 ring-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <ArrowRightStartOnRectangleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium">
                      Join Community
                    </span>
                  </button>
                )}

                {data.createdById === session?.user?.id ? (
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-full border border-gray-400 bg-white px-3.5 py-2 text-gray-900 ring-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <CogIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="ml-2 text-sm font-medium">Settings</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-full border border-rose-400 bg-white px-3.5 py-2 text-rose-900 ring-rose-400 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <FlagIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="ml-2 text-sm font-medium">Report</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </LayoutContainer>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const _community = await loadCommunity(ctx.params!.id as string);

  if (!_community) {
    return {
      notFound: true,
    };
  }

  return { props: { _community } };
};
