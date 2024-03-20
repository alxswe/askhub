/* eslint-disable @next/next/no-img-element */
import { useAxiosResponse } from "@/components/client/hook";
import LayoutContainer from "@/components/layout/Container";
import { UserContext } from "@/components/layout/context/user";
import { loadUser } from "@/components/loaders/loader";
import { QuestionList } from "@/components/question/list";
import { getServerAuthSession } from "@/server/auth";
import { FlagIcon } from "@heroicons/react/20/solid";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import pluralize from "pluralize";
import { useContext, useState } from "react";

interface Props {
  _user: Record<string, any>;
}

export default function UserDetailProfile({ _user }: Props) {
  const { data: session } = useSession();
  const { currentUser } = useContext(UserContext);
  const params = useParams();

  const [response, setResponse] = useAxiosResponse();
  const [data, setCurrentUser] = useState<Record<string, any>>({
    ..._user,
  });

  return (
    <LayoutContainer>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 xl:col-span-2">
          <h1 className="sr-only">Questions</h1>
          <QuestionList createdById={params.id} />
        </div>
        <aside className="relative order-first lg:order-last lg:col-span-1 xl:col-span-1">
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-lg bg-gray-50">
              <div className="flex flex-col items-center justify-center px-4 py-6 sm:p-6">
                <img
                  className="h-24 w-24 rounded-full"
                  src={data.image}
                  alt=""
                />
                <div className="mt-6 text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    u/{data.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {data.communities?.length}{" "}
                    {pluralize("Community", data.communities?.length)}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col space-y-2 border-t border-gray-200 bg-gray-200 px-4 py-6 sm:p-6">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-3.5 py-2 text-rose-700 ring-1 ring-inset ring-rose-400 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <FlagIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="ml-2 text-sm font-medium">Report</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </LayoutContainer>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  const _user = await loadUser(ctx.params!.id as string);

  if (!_user) {
    return {
      notFound: true,
    };
  }

  // Your logic to determine whether to redirect
  const shouldRedirect = session?.user.id === ctx.params!.id; // Example condition

  // If redirect is needed
  if (shouldRedirect) {
    return {
      redirect: {
        destination: "/user", // The URL to redirect to
        permanent: true, // Whether the redirect is permanent or temporary
      },
    };
  }

  return { props: { session, _user } };
};
