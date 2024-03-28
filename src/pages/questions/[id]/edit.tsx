import TailwindAlert from "@/components/alert/http";
import { useAxiosResponse } from "@/components/client/hook";
import LayoutContainer from "@/components/layout/Container";
import SimpleMDEEditor from "@/components/layout/simplemde";
import { loadQuestion } from "@/components/loaders/loader";
import { getServerAuthSession } from "@/server/auth";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

interface Props {
  _question: IQuestion;
}

export default function QuestionCreatePage({ _question }: Props) {
  const params = useParams();
  const router = useRouter();
  const [response, setResponse] = useAxiosResponse();
  const [data, setData] = useState({
    ..._question,
  });

  function onChange(e: React.FormEvent<any>) {
    const { currentTarget } = e,
      { name, value } = currentTarget;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/questions/" + _question.id, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const state = await res.json();
    if (res.ok) {
      router.push("/questions/" + data.id);
    } else {
      setResponse(state);
    }
  }

  const onEditorChange = useCallback((content: string) => {
    setData((prev) => ({ ...prev, content }));
  }, []);

  const disableButton = useMemo(
    () => !data.content || !data.name,
    [data.content, data.name],
  );

  return (
    <LayoutContainer>
      <form onSubmit={onSubmit} className="px-4 py-6 sm:px-0  lg:py-0">
        <div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-5">
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-gray-900 lg:text-lg">
                Update your question
              </h1>
            </div>
            <div className="flex flex-shrink-0 items-center gap-x-2">
              <button
                type="submit"
                disabled={disableButton}
                className="inline-flex w-full items-center justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:bg-gray-300 sm:w-fit"
              >
                Update
              </button>
              <Link
                href={{
                  pathname: "/questions/[id]",
                  query: { id: data.id },
                }}
                className="inline-flex w-full items-center justify-center rounded-md p-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:bg-gray-300 sm:w-fit"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <TailwindAlert error={response} />
            <div className="space-y-4">
              <div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Question
                  </label>
                  <p className="text-sm text-gray-500">
                    Be specific and imagine you’re asking a question to another
                    person
                  </p>
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  minLength={3}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                  value={data.name}
                  onChange={onChange}
                />
              </div>
              <div>
                <div className="">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Body
                  </label>
                  <p className="text-sm text-gray-500">
                    Include all the information someone would need to answer
                    your question
                  </p>
                </div>
                <div className="mt-2">
                  <SimpleMDEEditor
                    value={data.content}
                    onChange={onEditorChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </LayoutContainer>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  const _question = await loadQuestion(ctx.params!.id as string);

  if (!_question) {
    return {
      notFound: true,
    };
  }

  return { props: { session, _question } };
};
