/* eslint-disable @next/next/no-img-element */
import { Transition } from "@headlessui/react";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import router from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import TailwindAlert from "../alert/http";
import { useAxiosResponse } from "../client/hook";
import SimpleMDEEditor, { SimpleMDEPreview } from "../layout/simplemde";

interface IComment {
  id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  createdById: string;
  createdBy?: Record<string, any>;
  communityId: string;
  community?: Record<string, any>;
  questionId: string;
  question?: Record<string, any>;
}

interface Props {
  questionId?: any;
  showEditor?: boolean;
}

export default function CommentList({ questionId, showEditor = false }: Props) {
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
        <ul role="list" className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <li key={comment.id} className="py-5">
              <div className="flex">
                <img
                  className="h-10 w-10 flex-none rounded-full bg-gray-50 object-contain object-center"
                  src={comment.createdBy?.image}
                  alt={comment.createdBy?.name}
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    u/{comment.createdBy?.name}
                  </p>
                  <p className="flex-none text-xs text-gray-600">
                    <time dateTime={comment.createdAt}>
                      {moment(comment.createdAt).fromNow()}
                    </time>
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <SimpleMDEPreview source={comment.content} />
              </div>
            </li>
          ))}
          {hasContent && (
            <li>
              <button
                type="button"
                onClick={handleOffset}
                className="inline-flex w-full items-center justify-center px-3.5 py-2 font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Load More
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
