/* eslint-disable @next/next/no-img-element */
import TailwindAlert from "@/components/alert/http";
import { useAxiosResponse } from "@/components/client/hook";
import CommentList from "@/components/comments/component";
import DeleteNotification from "@/components/layout/DeleteNotification";
import { formatNumber } from "@/components/utils/renderValue";
import { BookmarkIcon as FilledBookmarkIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import pluralize from "pluralize";
import { useContext, useMemo, useState } from "react";
import { UserContext } from "../layout/context/user";
import { SimpleMDEPreview } from "../layout/simplemde";
import { IQuestion } from "./list";

interface Props {
  _question: IQuestion;
}

export function QuestionDetail({ _question }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const userContext = useContext(UserContext);

  const [isDeleting, setDeleting] = useState(false);
  const [isCommenting, setCommenting] = useState(false);
  const [response, setResponse] = useAxiosResponse();
  const [data, setData] = useState<typeof _question>({ ..._question });

  const handleDelete = async () => {
    const res = await fetch("/api/questions/" + data.id, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      router.push("/questions");
    } else {
      setResponse(res);
    }
  };

  const isUpvoted = useMemo(() => {
    return data?.upvotes?.includes(session?.user.id!);
  }, [data?.upvotes, session?.user.id]);

  const isDownvoted = useMemo(() => {
    return data?.downvotes?.includes(session?.user.id!);
  }, [data?.downvotes, session?.user.id]);

  const isBookmarked = useMemo(() => {
    return userContext.currentUser?.bookmark?.includes(data.id);
  }, [data.id, userContext.currentUser?.bookmark]);

  const handleUp = async () => {
    const userId = session?.user.id as string;
    let { upvotes, downvotes } = data;

    if (upvotes.includes(userId)) {
      upvotes = upvotes.filter((_id) => _id !== userId);
    } else {
      downvotes = downvotes.filter((_id) => _id !== userId);
      upvotes.push(userId);
    }

    const res = await fetch("/api/questions/" + data.id, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ ...data, upvotes, downvotes }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const dt = await res.json();
      setData((prev) => ({ ...prev, ...dt }));
    } else {
      setResponse(res);
    }
  };

  const handleDown = async () => {
    const userId = session?.user.id as string;
    let { upvotes, downvotes } = data;

    if (downvotes.includes(userId)) {
      downvotes = downvotes.filter((_id) => _id !== userId);
    } else {
      upvotes = upvotes.filter((_id) => _id !== userId);
      downvotes.push(userId);
    }

    const res = await fetch("/api/questions/" + data.id, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ ...data, upvotes, downvotes }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const dt = await res.json();
      setData((prev) => ({ ...prev, ...dt }));
    } else {
      setResponse(res);
    }
  };

  const handleBookmark = async () => {
    let { bookmark } = userContext.currentUser ?? { bookmark: [] };

    if (bookmark.includes(data.id)) {
      bookmark = bookmark.filter((_id: string) => _id !== data.id);
    } else {
      bookmark.push(data.id);
    }

    const res = await fetch("/api/users/" + session?.user.id, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ ...userContext.currentUser, bookmark }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const dt = await res.json();
      userContext.setUser(dt);
    } else {
      setResponse(res);
    }
  };

  return (
    <div className="max-w-3xl">
      <DeleteNotification
        show={isDeleting}
        setShow={() => setDeleting(false)}
        callback={handleDelete}
      />
      <TailwindAlert error={response} />
      <article aria-labelledby={"question-name-" + data?.id}>
        <div>
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <h2
                id={"question-name-" + data?.id}
                className="text-base font-semibold text-gray-900"
              >
                {data.name}
              </h2>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-sm">
              <p>
                <span className="text-gray-500">Asked</span>
                <span className="text-gray-900">
                  {" "}
                  {moment(data.createdAt).fromNow()}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Modified</span>
                <span className="text-gray-900">
                  {" "}
                  {moment(data.updatedAt).fromNow()}
                </span>
              </p>
              {data.communityId && (
                <p className="gap-x-1">
                  <span className="text-gray-500">In</span>{" "}
                  <span className="text-gray-900">{data?.community?.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex">
          <div className="flex-shrink-0">
            <ul className="space-y-1 text-center">
              <li>
                <button
                  type="button"
                  onClick={handleUp}
                  className={clsx(
                    isUpvoted
                      ? "text-emerald-400 hover:text-emerald-500"
                      : "text-gray-400 hover:text-gray-500",
                    "flex items-center space-x-2",
                  )}
                >
                  <ArrowUpCircleIcon className="h-5 w-5" />
                </button>
              </li>
              <li>
                <p className="text-gray-500">
                  {data.upvotes.length - data.downvotes.length}
                </p>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleDown}
                  className={clsx(
                    isDownvoted
                      ? "text-rose-400 hover:text-rose-500"
                      : "text-gray-400 hover:text-gray-500",
                    "flex items-center space-x-2",
                  )}
                >
                  <ArrowDownCircleIcon className="h-5 w-5" />
                </button>
              </li>
              <li className="pt-3">
                <button
                  type="button"
                  onClick={handleBookmark}
                  className={clsx(
                    isBookmarked
                      ? "text-indigo-400 hover:text-indigo-500"
                      : "text-gray-400 hover:text-gray-500",
                    "flex items-center space-x-2",
                  )}
                >
                  {isBookmarked ? (
                    <FilledBookmarkIcon className="h-5 w-5" />
                  ) : (
                    <BookmarkIcon className="h-5 w-5" />
                  )}
                </button>
              </li>
            </ul>
          </div>
          <div className="ml-3 flex-1 overflow-hidden">
            <SimpleMDEPreview source={data.content} />
          </div>
        </div>
        <div className="mt-6 flex items-start justify-between space-x-8">
          <ul className="flex items-center text-sm">
            {session?.user?.id && (
              <li>
                <button
                  type="button"
                  onClick={() => setCommenting((prev) => !prev)}
                  className="pr-2 text-gray-700 hover:text-gray-600"
                >
                  Answer
                </button>
              </li>
            )}

            {session?.user?.id === data.createdById && (
              <>
                {" "}
                <li>
                  <Link
                    href={{
                      pathname: "/questions/[id]/edit",
                      query: { id: data.id },
                    }}
                    className="pr-2 text-gray-700 hover:text-gray-600"
                  >
                    Edit
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setDeleting(true)}
                    className="pr-2 text-gray-700 hover:text-gray-600"
                  >
                    Delete
                  </button>
                </li>
                <li>
                  <button className="pr-2 text-gray-700 hover:text-gray-600">
                    Flag
                  </button>
                </li>
              </>
            )}
          </ul>
          <div className="min-w-max rounded-md bg-gray-50 px-3.5 py-2 !text-xs">
            <p className="text-gray-500">
              <span className="text-gray-500">Asked</span>{" "}
              <time dateTime={data?.createdAt} className="text-gray-900">
                {moment(data?.createdAt).fromNow()}
              </time>
            </p>
            <div className="mt-2 flex space-x-3">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full object-contain object-center"
                  src={data?.createdBy?.image}
                  alt={data?.createdBy?.username}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">
                  <Link
                    href={{
                      pathname: "/user/[id]",
                      query: { id: data?.createdById },
                    }}
                    className="hover:underline"
                  >
                    u/{data?.createdBy?.name}
                  </Link>
                </p>
                <p className="text-gray-600">
                  {formatNumber(data?.createdBy?.followers.length)}{" "}
                  {pluralize("Follower", data?.createdBy?.followers.length)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
      <div className="mt-6 border-t border-gray-200 pt-5">
        <CommentList showEditor={isCommenting} questionId={data?.id} />
      </div>
    </div>
  );
}
