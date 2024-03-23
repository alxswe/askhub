/* eslint-disable @next/next/no-img-element */
import UserCommunities from "@/components/community/user";
import LayoutContainer from "@/components/layout/Container";
import { loadUser } from "@/components/loaders/loader";
import { FavoritedQuestionList } from "@/components/question/favorites";
import { QuestionList } from "@/components/question/list";
import { getServerAuthSession } from "@/server/auth";
import { Tab } from "@headlessui/react";
import {
  ArrowLeftEndOnRectangleIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { GetServerSidePropsContext } from "next";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import pluralize from "pluralize";
import { Fragment, useState } from "react";

interface Props {
  _user: Record<string, any>;
}

const tabs = [
  { name: "My Questions", href: "#", current: false },
  { name: "Favorites", href: "#", current: false },
];

export default function UserProfile({ _user }: Props) {
  const router = useRouter();
  const [currentTab, setTab] = useState(tabs[0]?.name ?? "");

  return (
    <LayoutContainer>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 xl:col-span-2">
          <Tab.Group>
            <div className="border-b border-gray-200">
              <Tab.List as="nav" className="-mb-px flex">
                {tabs.map((tab) => (
                  <Tab key={tab.name} as={Fragment}>
                    {({ selected }) => (
                      <button
                        type="button"
                        className={clsx(
                          selected
                            ? "border-rose-500 text-rose-600"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "w-1/2 border-b-2 px-1 py-4 text-center text-sm font-medium",
                        )}
                      >
                        {tab.name}
                      </button>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>
            <Tab.Panels>
              <Tab.Panel>
                <h1 className="sr-only">Questions</h1>
                <QuestionList createdById={_user.id} />
              </Tab.Panel>
              <Tab.Panel>
                <h1 className="sr-only">Favorites</h1>
                <FavoritedQuestionList />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <aside className="relative order-first lg:order-last lg:col-span-1 xl:col-span-1">
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-lg bg-gray-50">
              <div className="flex flex-col items-center justify-center px-4 py-6 sm:p-6">
                <img
                  className="h-24 w-24 rounded-full"
                  src={_user.image}
                  alt=""
                />
                <div className="mt-6 text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    u/{_user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {_user.followers.length}{" "}
                    {pluralize("Follower", _user.followers.length)}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col space-y-2 border-t border-gray-200 bg-gray-200 px-4 py-6 sm:p-6">
                <Link
                  href="/user/update"
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-3.5 py-2 text-gray-900 ring-1 ring-inset ring-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="ml-2 text-sm font-medium">Update</span>
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    signOut({ redirect: false }).then((res) => router.push("/"))
                  }
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-3.5 py-2  text-rose-700 ring-1 ring-inset ring-rose-400 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <ArrowLeftEndOnRectangleIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm font-medium">Sign out</span>
                </button>
              </div>
            </div>
            <div className="hidden pt-6 lg:block">
              <UserCommunities />
            </div>
          </div>
        </aside>
      </div>
    </LayoutContainer>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      notFound: true,
    };
  }

  const _user = await loadUser(session?.user?.id as string);
  if (!_user) {
    return {
      notFound: true,
    };
  }

  return { props: { session, _user } };
};
