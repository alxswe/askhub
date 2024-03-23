import TailwindAlert from "@/components/alert/http";
import { useAxiosResponse } from "@/components/client/hook";
import LayoutContainer from "@/components/layout/Container";
import { loadUser } from "@/components/loaders/loader";
import { getServerAuthSession } from "@/server/auth";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { GetServerSidePropsContext } from "next";
import { User } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

interface Props {
  _user: User;
}

export default function UserUpdatePage({ _user }: Props) {
  const router = useRouter();
  const [response, setResponse] = useAxiosResponse();
  const [data, setData] = useState<User>({
    ..._user,
  });

  function onChange(e: React.FormEvent<any>) {
    const { currentTarget } = e,
      { name, value } = currentTarget;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/users/" + _user.id, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log({ res });

    const state = await res.json();
    if (res.ok) {
      router.push("/user");
    } else {
      setResponse(state);
    }
  }

  const disableButton = useMemo(() => !data.name, [data.name]);

  return (
    <LayoutContainer>
      <form onSubmit={onSubmit} className="px-4 py-6 sm:px-0  lg:py-0">
        <div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-5">
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-gray-900 lg:text-lg">
                Update your profile
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
                  pathname: "/user",
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
                    Name
                  </label>
                  <p className="text-sm text-gray-500">
                    Your name will be visible to the public
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
                  value={data.name!}
                  onChange={onChange}
                />
              </div>
              <div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <p className="text-sm text-gray-500">
                    Email updates are should be made on the provider&apos;s
                    settings
                  </p>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  minLength={3}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 disabled:text-gray-400 sm:text-sm sm:leading-6"
                  placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                  value={data.email!}
                  disabled={true}
                  onChange={onChange}
                />
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
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
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
