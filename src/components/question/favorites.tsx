/* eslint-disable @next/next/no-img-element */
import {
  ArchiveBoxArrowDownIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { createContext, useCallback, useEffect, useState } from "react";
import TailwindAlert from "../alert/http";
import { useAxiosResponse } from "../client/hook";
import LoadingNotification from "../layout/LoadingNotification";
import { removeObjectInList, updateObjectInList } from "../utils/array";
import { QuestionComponent } from "./component";
import { SortChoices } from "./list";

export const FavoritedQuestionListContext = createContext<{
  addQuestionToList: (...args: any) => void;
  updateQuestionInList: (...args: any) => void;
  removeQuestionFromList: (...args: any) => void;
}>({
  addQuestionToList: () => {},
  updateQuestionInList: () => {},
  removeQuestionFromList: () => {},
});

export function FavoritedQuestionList() {
  const router = useRouter();
  const [params, setParams] = useState({
    take: 9,
    skip: 0,
    orderBy: "createdAt",
  });

  const [response, setResponse] = useAxiosResponse();
  const [data, setData] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestionToList = (question: IQuestion) => {
    const results = [...data];
    results.unshift(question);
    setData(() => results);
  };

  const updateQuestionInList = (question: IQuestion) => {
    const results = updateObjectInList(data, question, "id");
    setData(() => results);
  };

  const removeQuestionFromList = (question: IQuestion) => {
    const results = removeObjectInList(data, question, "id");
    setData(() => results);
  };

  const fetchQuestions = useCallback(async () => {
    const controller = new AbortController();

    setLoading((_) => true);

    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      // @ts-expect-error:  No index signature with a parameter of type 'string' was found on type '{ take: number; skip: number; }'.ts(7053)
      searchParams.set(key, params[key] as string);
    });

    const res = await fetch(`/api/users/favorites?${searchParams}`, {
      credentials: "include",
      signal: controller.signal,
    });
    if (res.ok) {
      const data = await res.json();
      setData((prev) => {
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

  const handleOffset = () => {
    setParams((prev) => ({
      ...prev,
      skip: data.length + prev.take,
    }));
  };

  useEffect(() => {
    if (router.isReady) {
      fetchQuestions();
    }
  }, [fetchQuestions, router.isReady]);

  return (
    <FavoritedQuestionListContext.Provider
      value={{
        addQuestionToList,
        updateQuestionInList,
        removeQuestionFromList,
      }}
    >
      <div className="mb-3 bg-gray-200 p-2 px-4">
        <SortChoices
          label="Sorting"
          options={[
            {
              name: <ArchiveBoxArrowDownIcon className="h-5 w-5" />,
              value: "createdAt",
              title: "Neweset",
            },
            {
              name: <ClockIcon className="h-5 w-5" />,
              value: "updatedAt",
              title: "Recent Activity",
            },
          ]}
          value={params.orderBy}
          onChange={(orderBy) => setParams((prev) => ({ ...prev, orderBy }))}
        />
      </div>
      {data?.length > 0 ? (
        <div className="space-y-6">
          <TailwindAlert error={response} />

          <ul role="list" className="space-y-4 divide-y divide-gray-200">
            {data?.map((question) => {
              return (
                <div key={question.id} className="px-4 py-3 lg:px-0">
                  <QuestionComponent question={question} />
                </div>
              );
            })}
            <li>
              <button
                type="button"
                onClick={handleOffset}
                className="inline-flex w-full items-center justify-center px-3.5 py-2 font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Load More
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="py-12 text-center">
          <QuestionMarkCircleIcon
            className="mx-auto h-12 w-12 text-gray-400"
            aria-hidden="true"
          />

          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No questions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by asking a new question.
          </p>
        </div>
      )}

      <LoadingNotification show={loading} />
    </FavoritedQuestionListContext.Provider>
  );
}
