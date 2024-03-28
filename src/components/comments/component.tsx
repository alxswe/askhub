/* eslint-disable @next/next/no-img-element */
import {
  CheckCircleIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useAxiosResponse } from "../client/hook";
import SimpleMDEEditor, { SimpleMDEPreview } from "../layout/simplemde";
import { CommentListContext } from "./context";

export const CommentComponent: React.FC<{ comment: IComment }> = ({
  comment,
}) => {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const context = useContext(CommentListContext);
  const [response, setResponse] = useAxiosResponse();
  const [data, setData] = useState<typeof comment>({ ...comment });

  useEffect(() => {
    setData({ ...comment });
  }, [comment]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/comments/" + data.id, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const dt = await res.json();
      context.updateCommentInList(dt);
      setEditing((_) => false);
    } else {
      setResponse(res);
    }
  };

  const deleteComment = async () => {
    const res = await fetch("/api/comments/" + data.id, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      context.removeCommentFromList(data);
    } else {
      setResponse(res);
    }
  };

  return (
    <li key={data.id} className="py-5">
      {deleting && (
        <div className="mb-5 rounded-md bg-rose-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <TrashIcon className="h-5 w-5 text-rose-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-rose-800">Are you sure?</p>
            </div>
            <div className="ml-auto flex items-center gap-x-2 pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={deleteComment}
                  className="inline-flex rounded-md bg-rose-50 p-1.5 text-rose-500 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 focus:ring-offset-rose-50"
                >
                  <span className="sr-only">Yes</span>
                  <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setDeleting((_) => false)}
                  className="inline-flex rounded-md bg-rose-50 p-1.5 text-rose-500 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 focus:ring-offset-rose-50"
                >
                  <span className="sr-only">Dismiss</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {editing ? (
        <form onSubmit={onSubmit} className="relative">
          <SimpleMDEEditor
            preview={false}
            value={data.content}
            onChange={(content: string) =>
              setData((prev) => ({ ...prev, content }))
            }
          />
          <div className="absolute bottom-12 right-3 origin-top-right">
            <button
              type="submit"
              disabled={!data.content}
              className="inline-flex items-center justify-center rounded-md bg-rose-600 p-1 text-white hover:bg-rose-500 disabled:bg-gray-200"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      ) : (
        <article>
          <div className="flex items-start">
            <div className="flex flex-1">
              <img
                className="h-10 w-10 flex-none rounded-full bg-gray-50 object-contain object-center"
                src={data.createdBy?.image}
                alt={data.createdBy?.name}
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  u/{data.createdBy?.name}
                </p>
                <p className="flex-none text-xs text-gray-600">
                  <time dateTime={data.createdAt}>
                    {moment(data.createdAt).fromNow()}
                  </time>
                </p>
              </div>
            </div>
            {session?.user?.id === data.createdById && (
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-700"
                  onClick={() => setEditing((_) => true)}
                >
                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="text-rose-600 hover:text-rose-500"
                  onClick={() => setDeleting((_) => true)}
                >
                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-5">
            <SimpleMDEPreview source={data.content} />
          </div>
        </article>
      )}
    </li>
  );
};
