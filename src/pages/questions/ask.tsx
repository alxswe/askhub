import TailwindAlert from "@/components/alert/http";
import { useAxiosResponse } from "@/components/client/hook";
import LayoutContainer from "@/components/layout/Container";
import SimpleMDEEditor from "@/components/layout/simplemde";
import { loadCommunities } from "@/components/loaders/loader";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

interface Props {
  communities: ICommunity[];
}

export default function QuestionCreatePage({ communities = [] }: Props) {
  const router = useRouter();
  const [response, setResponse] = useAxiosResponse();
  const [data, setData] = useState({
    name: "",
    communityId: router.query.communityId,
    content: "",
  });

  function onChange(e: React.FormEvent<any>) {
    const { currentTarget } = e,
      { name, value } = currentTarget;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/questions", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const state = await res.json();
    if (res.ok) {
      router.push("/questions/" + state.id);
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
            <div className="min-w-0 flex-1 truncate">
              <h1 className="text-sm font-semibold text-gray-900 lg:text-lg">
                Ask your question
              </h1>
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                disabled={disableButton}
                className="inline-flex w-full items-center justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:bg-gray-300 sm:w-fit"
              >
                Post
              </button>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <TailwindAlert error={response} />
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Community
                </label>
                <select
                  name="communityId"
                  id="communityId"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 disabled:text-gray-500 sm:text-sm sm:leading-6"
                  value={data.communityId}
                  onChange={onChange}
                  disabled={!!router.query.communityId}
                >
                  <option value="">Select a community</option>
                  {communities.map((community) => (
                    <option key={community.name} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>
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
  const communities = await loadCommunities({ userId: session?.user.id });

  return { props: { session, communities } };
};
