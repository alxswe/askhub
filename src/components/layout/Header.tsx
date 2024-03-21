/* eslint-disable @next/next/no-img-element */
import { Menu, Popover, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  BellIcon,
  HomeIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import _ from "lodash";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { Fragment, useCallback, useRef, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { ICommunity } from "../community/component";
import { IQuestion } from "../question/list";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, current: false },

  {
    name: "Communities",
    href: "/communities",
    icon: UserGroupIcon,
    current: false,
  },
];

const userNavigation = [
  { name: "Your Profile", href: "/user" },
  { name: "Sign out", href: "/sign-out" },
];

export default function Header() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    communities: ICommunity[];
    questions: IQuestion[];
  }>({
    communities: [],
    questions: [],
  });
  const { data: session } = useSession();

  const abortControllerRef = useRef(new AbortController());
  const searchRef = useRef("");

  const loadCommunities = useCallback(async () => {
    const { signal } = abortControllerRef.current;

    const params = new URLSearchParams();
    params.set("search", searchRef.current);
    const res = await fetch(`/api/communities?${params}`, { signal });
    const data = await res.json();
    setResults((prev) => ({ ...prev, communities: data }));
  }, []);

  const loadQuestions = useCallback(async () => {
    const { signal } = abortControllerRef.current;

    const params = new URLSearchParams();
    params.set("search", searchRef.current);
    const res = await fetch(`/api/questions?${params}`, { signal });
    const data = await res.json();
    setResults((prev) => ({ ...prev, questions: data }));
  }, []);

  const loadSearch = useCallback(async () => {
    setLoading((_) => true);
    abortControllerRef.current.abort(); // Cancel the previous requests
    abortControllerRef.current = new AbortController(); // Create a new AbortController

    await loadCommunities();
    await loadQuestions();

    setLoading((_) => false);
  }, [loadCommunities, loadQuestions]);

  const debouncedSearch = _.debounce(loadSearch, 1000);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { currentTarget } = e;
    const { value } = currentTarget;

    setQuery((_) => value);
    searchRef.current = value;

    if (value === "") {
      setResults({ communities: [], questions: [] });
    } else {
      debouncedSearch();
    }
  };

  return (
    <Popover
      as="header"
      className={({ open }) =>
        clsx(
          open ? "fixed inset-0 z-40 overflow-y-auto" : "",
          "bg-white shadow-sm lg:static lg:overflow-y-visible",
        )
      }
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
              <div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
                <div className="flex flex-shrink-0 items-center">
                  <Link
                    href="/"
                    className="inline-flex items-center overflow-hidden text-sm font-semibold"
                  >
                    <span className="pr-1">Ask</span>
                    <span className="rounded-md bg-rose-600 px-1 py-1 text-white">
                      Hub
                    </span>
                  </Link>
                </div>
              </div>
              <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                  <div className="relative w-full">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="search"
                        name="search"
                        className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500 sm:text-sm sm:leading-6"
                        placeholder="Search"
                        type="search"
                        onChange={onChange}
                        value={query}
                      />
                    </div>
                    <Transition show={searchRef.current !== ""}>
                      <div className="absolute z-50 mt-3 max-h-96 w-full space-y-6 overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 py-6 ring-inset sm:p-6">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-700">
                              Communities
                            </h3>
                            <BeatLoader
                              color="rgb(107 114 128)"
                              size={5}
                              loading={loading}
                            />
                          </div>
                          {results.communities.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                              {results.communities.map((elm) => (
                                <li
                                  key={elm.name}
                                  className="line-clamp-1 w-full text-sm font-medium text-gray-800"
                                >
                                  <Link
                                    className="justify-left inline-flex w-full items-center hover:text-gray-500"
                                    href={{
                                      pathname: "/communities/[id]",
                                      query: { id: elm.id },
                                    }}
                                  >
                                    {elm.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 line-clamp-1 text-sm font-medium text-gray-500">
                              Nothing matches your search.
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-700">
                              Questions
                            </h3>
                            <BeatLoader
                              color="rgb(107 114 128)"
                              size={5}
                              loading={loading}
                            />
                          </div>
                          {results.questions.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                              {results.questions.map((elm) => (
                                <li
                                  key={elm.name}
                                  className="mt-2 line-clamp-1 text-sm font-medium text-gray-800"
                                >
                                  <Link
                                    className="justify-left inline-flex w-full items-center hover:text-gray-500"
                                    href={{
                                      pathname: "/questions/[id]",
                                      query: { id: elm.id },
                                    }}
                                  >
                                    {elm.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 line-clamp-1 text-sm font-medium text-gray-500">
                              Nothing matches your search.
                            </p>
                          )}
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
              <div className="flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden">
                {/* Mobile menu button */}
                <Popover.Button className="relative -mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Popover.Button>
              </div>
              {session?.user ? (
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                  <a
                    href="#"
                    className="ml-5 flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </a>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-5 flex-shrink-0">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={session?.user?.image}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={clsx(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700",
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <Link
                    href="/questions/ask"
                    className="ml-6 inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    <PlusIcon className="mr-1 h-5 w-5" aria-hidden="true" />
                    <span>Create</span>
                  </Link>
                </div>
              ) : (
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                  <button
                    type="button"
                    onClick={() => signIn("github")}
                    className="ml-6 inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>

          <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={clsx(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "hover:bg-gray-50",
                    "block rounded-md px-3 py-2 text-base font-medium",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {session?.user ? (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={session?.user?.image}
                        alt={session?.user?.name as string}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {session?.user?.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {session?.user?.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mx-auto mt-6 max-w-3xl px-4 sm:px-6">
                  <Link
                    href="/questions/ask"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-rose-700"
                  >
                    <PlusIcon className="mr-1 h-5 w-5" aria-hidden="true" />
                    <span>Create</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="mx-auto mt-6 max-w-3xl px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => signIn("github", { redirect: false })}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-rose-700"
                >
                  Login
                </button>
              </div>
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
