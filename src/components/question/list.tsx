/* eslint-disable @next/next/no-img-element */
import { RadioGroup } from "@headlessui/react";
import {
  ArchiveBoxArrowDownIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { uniqueId } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import TailwindAlert from "../alert/http";
import { useAxiosResponse } from "../client/hook";
import LoadingNotification from "../layout/LoadingNotification";
import { removeObjectInList, updateObjectInList } from "../utils/array";
import { QuestionComponent } from "./component";
import { QuestionListContext } from "./context";

interface Props {
  communityId?: any;
  createdById?: any;
}

export const SortChoices = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { name: any; value: any; title?: string }[];
  value: any;
  onChange: (...args: any) => any;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-sm font-medium leading-6 text-gray-900">{label}</h2>
      </div>

      <RadioGroup
        as="div"
        value={value}
        onChange={onChange}
        className="justify-end"
      >
        <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
        <div className="flex items-center gap-x-2">
          {options.map((option) => (
            <RadioGroup.Option
              key={uniqueId()}
              title={option.title}
              value={option.value}
              className={({ active, checked }) =>
                clsx(
                  active ? "ring-2 ring-indigo-600 ring-offset-2" : "",
                  checked
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                  "flex items-center justify-center rounded-md p-2 text-sm font-semibold sm:flex-1",
                )
              }
            >
              <RadioGroup.Label as="span">{option.name}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export function QuestionList({ communityId, createdById }: Props) {
  const { data: session } = useSession();
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
    if (communityId) {
      searchParams.set("communityId", communityId);
    }

    if (createdById) {
      searchParams.set("createdById", createdById);
    }

    const res = await fetch(`/api/questions?${searchParams}`, {
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
  }, [communityId, createdById, params, setResponse]);

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
    <QuestionListContext.Provider
      value={{
        communityId,
        addQuestionToList,
        updateQuestionInList,
        removeQuestionFromList,
      }}
    >
      <div className="mb-3 bg-gray-200 px-4 py-2">
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
    </QuestionListContext.Provider>
  );
}
