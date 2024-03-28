import { Transition } from "@headlessui/react";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import router from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import TailwindAlert from "../alert/http";
import { useAxiosResponse } from "../client/hook";
import SimpleMDEEditor from "../layout/simplemde";
import { removeObjectInList, updateObjectInList } from "../utils/array";
import { CommentComponent } from "./component";
import { CommentListContext } from "./context";

interface Props {
  questionId?: any;
  showEditor?: boolean;
  setshowEditor?: (...args: any) => any;
}

export default function CommentList({
  questionId,
  showEditor = false,
  setshowEditor,
}: Props) {
  const [params, setParams] = useState<Record<string, any>>({
    take: 9,
    skip: 0,
  });

  const [content, setContent] = useState("");
  const [response, setResponse] = useAxiosResponse();
  const [comments, setComments] = useState<IComment[]>([]);

  const hasContent = useMemo(() => comments?.length > 0, [comments?.length]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/comments", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        questionId,
        content,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dt = await res.json();
    if (res.ok) {
      setComments((prev) => [dt, ...prev]);
      setshowEditor?.(false);
      setContent("");
    } else {
      setResponse(res);
    }
  };

  const handleOffset = () => {
    setParams((prev) => ({
      ...prev,
      skip: comments.length + prev.take,
    }));
  };

  const fetchComments = useCallback(
    async (load: boolean = true) => {
      const controller = new AbortController();
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key: string) => {
        searchParams.set(key, params[key]);
      });
      if (questionId) {
        searchParams.set("questionId", questionId);
      }

      const res = await fetch(`/api/comments?${searchParams}`, {
        credentials: "include",
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => {
          if (params.skip === 0) {
            return data;
          } else {
            return [...prev, ...data];
          }
        });
      } else {
        setResponse(res);
      }
      return () => {
        controller.abort();
      };
    },
    [params, questionId, setResponse],
  );

  useEffect(() => {
    if (router.isReady) {
      fetchComments();
    }
  }, [fetchComments]);

  const addCommentToList = (comment: IComment) => {
    const results = [...comments];
    results.unshift(comment);
    setComments(() => results);
  };

  const updateCommentInList = (comment: IComment) => {
    const results = updateObjectInList(comments, comment, "id");
    setComments(() => results);
  };

  const removeCommentFromList = (comment: IComment) => {
    const results = removeObjectInList(comments, comment, "id");
    setComments(() => results);
  };

  return (
    <div className="space-y-5">
      <TailwindAlert error={response} />

      <div className="space-y-4">
        <Transition
          show={showEditor}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <form onSubmit={onSubmit} className="relative">
            <SimpleMDEEditor
              preview={false}
              value={content}
              onChange={setContent}
            />
            <div className="absolute bottom-12 right-3 origin-top-right">
              <button
                type="submit"
                disabled={!content}
                className="inline-flex items-center justify-center rounded-md bg-rose-600 p-1 text-white hover:bg-rose-500 disabled:bg-gray-200"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </Transition>

        <CommentListContext.Provider
          value={{
            addCommentToList,
            updateCommentInList,
            removeCommentFromList,
          }}
        >
          <ul role="list" className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <CommentComponent key={comment.id} comment={comment} />
            ))}
            {hasContent ? (
              <li>
                <button
                  type="button"
                  onClick={handleOffset}
                  className="inline-flex w-full items-center justify-center px-3.5 py-2 font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  Load More
                </button>
              </li>
            ) : (
              <p className="text-sm font-medium text-gray-700">
                Be the first to answer on this post.
              </p>
            )}
          </ul>
        </CommentListContext.Provider>
      </div>
    </div>
  );
}
