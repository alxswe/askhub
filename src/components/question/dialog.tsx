/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from "@headlessui/react";
import {
  ChatBubbleLeftEllipsisIcon,
  HandThumbUpIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useContext } from "react";
import CommentList from "../comments/component";
import { formatNumber, renderValue } from "../utils/renderValue";
import { QuestionComponentContext } from "./component";
import { IQuestion } from "./list";

import { CodeBlock, Pre } from "../layout/markdown/CodeBlock";
import { SimpleMDEPreview } from "../layout/simplemde";

interface FloatingQuestionDetailProps<T> {
  element: T | Partial<T> | null;
}

export default function FloatingQuestionDetail({
  element,
}: FloatingQuestionDetailProps<IQuestion>) {
  const context = useContext(QuestionComponentContext);
  const MarkdownOptions = { code: CodeBlock, pre: Pre };

  return (
    <Transition.Root show={context.action === "open"} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={context.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="min-h-full w-full items-end justify-center text-center sm:flex sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative min-h-screen transform overflow-hidden bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:min-h-full sm:w-full sm:max-w-7xl sm:rounded-lg sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="sr-only pb-5 text-lg font-medium text-gray-900"
                >
                  {context.element?.name}
                </Dialog.Title>

                <article
                  aria-labelledby={"question-name-" + element?.id}
                  className="relative"
                >
                  <div>
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-contain object-center"
                          src={context.element?.createdBy?.image}
                          alt={context.element?.createdBy?.username}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          <Link
                            href={{
                              pathname: "/user/[id]",
                              query: { id: element?.createdById },
                            }}
                            className="hover:underline"
                          >
                            u/{context.element?.createdBy?.name}
                          </Link>
                          {context.element?.communityId && (
                            <span className="text-gray-500">
                              {" "}
                              in{" "}
                              <Link
                                href={{
                                  pathname: "/communities/[id]",
                                  query: { id: element?.communityId },
                                }}
                                className="hover:underline"
                              >
                                {context.element?.community?.name}
                              </Link>
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          <Link
                            href={{
                              pathname: "/questions/[id]",
                              query: { id: element?.id },
                            }}
                            className="hover:underline"
                          >
                            <time dateTime={context.element?.createdAt}>
                              {renderValue(element?.createdAt, "datetime")}
                            </time>
                          </Link>
                        </p>
                      </div>
                      <div className="absolute right-0 top-0 origin-top-right">
                        <button
                          type="button"
                          onClick={context.onClose}
                          className="text-sm text-gray-700 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <h2
                      id={"question-name-" + context.element?.id}
                      className="mt-4 text-base font-medium text-gray-900"
                    >
                      {context.element?.name}
                    </h2>
                  </div>
                  <div
                    className="mt-2 space-y-4 text-sm text-gray-700"
                    // dangerouslySetInnerHTML={{ __html: data.content }}
                  >
                    <SimpleMDEPreview source={context.element?.content} />
                  </div>
                  <div className="mt-6 flex justify-between space-x-8">
                    <div className="flex space-x-6">
                      <span className="inline-flex items-center text-sm">
                        <button
                          type="button"
                          onClick={context.handleLike}
                          className={clsx(
                            context.isLiked
                              ? "text-rose-400 hover:text-rose-500"
                              : "text-gray-400 hover:text-gray-500",
                            "inline-flex space-x-2",
                          )}
                        >
                          <HandThumbUpIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                          <span className="font-medium text-gray-900">
                            {formatNumber(element?.likes?.length ?? 0)}
                          </span>
                          <span className="sr-only">likes</span>
                        </button>
                      </span>
                      <span className="inline-flex items-center text-sm">
                        <p className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                          <ChatBubbleLeftEllipsisIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                          <span className="font-medium text-gray-900">
                            {formatNumber(element?._count?.comments as number)}
                          </span>
                          <span className="sr-only">comments</span>
                        </p>
                      </span>
                    </div>
                    <div className="flex text-sm">
                      <span className="inline-flex items-center text-sm">
                        <button
                          type="button"
                          className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                        >
                          <ShareIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="font-medium text-gray-900">
                            Share
                          </span>
                        </button>
                      </span>
                    </div>
                  </div>
                </article>
                <div className="mt-6 border-t border-gray-200 pt-5 sm:max-h-80 sm:overflow-y-auto">
                  <CommentList questionId={context.element?.id} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
