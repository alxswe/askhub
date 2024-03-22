/* eslint-disable @next/next/no-img-element */
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import pluralize from "pluralize";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import TailwindAlert from "../alert/http";
import { useAxiosResponse } from "../client/hook";
import { IQuestion, QuestionListContext } from "./list";

export const QuestionComponentContext = createContext<{
  element: IQuestion | null;
  snapshot: IQuestion | null;
  action: string | null;
  isLiked: boolean;
  onClose: (...args: any) => void;
  handleUpdate?: (...args: any) => void;
  handleDelete: (...args: any) => void;
  handleLike: (...args: any) => void;
  handleComment?: (...args: any) => void;
}>({
  element: null,
  snapshot: null,
  action: null,
  isLiked: false,
  handleUpdate: () => {},
  handleDelete: () => {},
  handleLike: () => {},
  onClose: () => {},
});

export function QuestionComponent({ question }: { question: IQuestion }) {
  const { data: session } = useSession();
  const router = useRouter();
  const context = useContext(QuestionListContext);
  const [response, setResponse] = useAxiosResponse();
  const [action, setAction] = useState<"update" | "delete" | "open" | null>(
    null,
  );
  const [data, setData] = useState<typeof question>({ ...question });

  useEffect(() => {
    setData({ ...question });
  }, [question]);

  const handleDelete = async () => {
    const res = await fetch("/api/questions/" + data.id, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      context.removeQuestionFromList(data);
      setAction(() => null);
    } else {
      setResponse(res);
    }
  };

  const handleLike = async () => {
    let likes;
    if (data.likes.includes(session?.user?.id!)) {
      likes = data.likes.filter((_id) => _id !== session?.user.id);
    } else {
      likes = [...data.likes, session?.user.id];
    }

    const res = await fetch("/api/questions/" + data.id, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ ...data, likes }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const dt = await res.json();
      context.updateQuestionInList(dt);
    } else {
      setResponse(res);
    }
  };

  const isLiked = useMemo(
    () => data.likes.includes(session?.user.id!),
    [data.likes, session?.user?.id],
  );

  return (
    <QuestionComponentContext.Provider
      value={{
        element: data,
        snapshot: data,
        action,
        onClose: () => setAction(() => null),
        handleDelete,
        handleLike,
        isLiked,
      }}
    >
      <li key={data.id} className="bg-white">
        <TailwindAlert error={response} />

        <article
          aria-labelledby={"question-name-" + data.id}
          className="relative"
        >
          <div className="flex flex-col lg:flex-row lg:gap-x-2">
            <div className="flex flex-row gap-x-2 text-xs text-gray-700 lg:flex-col lg:gap-x-0">
              <dl className="flex gap-x-1 text-center text-gray-800">
                <dd>{data.upvotes.length - data.downvotes.length}</dd>
                <dt>
                  {pluralize(
                    "Vote",
                    data.upvotes.length - data.downvotes.length,
                  )}
                </dt>
              </dl>
              <dl className="flex gap-x-1 text-center text-gray-500">
                <dd>{data._count.comments}</dd>
                <dt>{pluralize("Answer", data._count.comments)}</dt>
              </dl>
            </div>
            <div className="lg:ml-2">
              <Link
                href={{
                  pathname: "/questions/[id]",
                  query: { id: data.id },
                }}
                className="text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                {data.name}
              </Link>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            {data.communityId ? (
              <Link
                href={{
                  pathname: "/communities/[id]",
                  query: { id: data.communityId },
                }}
                className="text-sm font-semibold text-gray-700 underline hover:text-gray-600"
              >
                r/{data.community!.name}
              </Link>
            ) : (
              <div />
            )}
            <div className="flex flex-col items-end text-sm">
              <p className="text-xs">
                <span className="text-gray-500">Asked</span>{" "}
                {moment(data.createdAt).fromNow()}
              </p>
              <Link
                href={{
                  pathname: "/user/[id]",
                  query: { id: data.createdById },
                }}
                className="hover:text-hover-600 mt-1 inline-flex gap-x-1 text-gray-700"
              >
                <img
                  className="h-5 w-5 rounded-md"
                  src={data.createdBy!.image}
                  alt=""
                />
                {data.createdBy!.name}
              </Link>
            </div>
          </div>
        </article>
      </li>
    </QuestionComponentContext.Provider>
  );
}
