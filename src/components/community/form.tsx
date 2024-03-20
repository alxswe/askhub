/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { httpClient } from "../client";
import { useAxiosResponse, useNextHeaders } from "../client/hook";
import DynamicForm from "../form";
import { ICommunity } from "./component";

interface FloatingCommunityFormProps<T> {
  element: T | Partial<T> | null;
  open: boolean;
  setOpen: (...args: any) => any;
  next: (...args: any) => any;
}

export function FloatingCommunityForm({
  element,
  open,
  setOpen,
  next,
}: FloatingCommunityFormProps<ICommunity>) {
  const { headers } = useNextHeaders();
  const [state, setState] = useState<Partial<ICommunity> | null>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useAxiosResponse();

  useEffect(() => {
    if (open) {
      setState((prev) => ({ ...element }));
    }
  }, [element, open]);

  const onChange = (e: React.FormEvent<any>) => {
    const { currentTarget } = e,
      { name, value, checked, type } = currentTarget;
    setState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading((_) => true);

    const data = { ...state };
    const res = await fetch("/api/communities", {
      method: "POST",
      body: JSON.stringify(data), // Convert data to JSON
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const ins = await res.json();
      next(ins);
    } else {
      setResponse(res);
    }

    setLoading((_) => false);
  };

  const fields = [
    {
      name: "name",
      label: "Community name",
      as: "input",
      inputProps: {
        type: "text",
        required: true,
        minLength: 3,
        maxLength: 21,
      },
    },
  ];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
          <div className="min-h-full w-full items-end justify-center p-4 text-center sm:flex sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="hidden pb-5 text-lg font-medium text-gray-900"
                >
                  {state?.id ? "Update" : "New"} Community
                </Dialog.Title>
                <DynamicForm
                  loading={loading}
                  response={response}
                  initial={state}
                  fields={fields}
                  onChange={onChange}
                  onSubmit={onSubmit}
                  cancel={setOpen}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface CommunityFormProps {
  next: (...args: any) => any;
  community?: any;
}

export function CommunityForm({ next, community }: CommunityFormProps) {
  const [response, setResponse] = useAxiosResponse();
  const { headers } = useNextHeaders();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    content: "",
  });

  const onChange = (e: React.FormEvent<any>) => {
    const { currentTarget } = e,
      { name, value } = currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const myElementRef = useRef(null);

  useEffect(() => {
    const myElement = myElementRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (myElement) {
            if (entry.isIntersecting) {
              // Element is in the viewport
              // Make the element visible
              // @ts-expect-error: Property 'style' does not exist on type 'never'.ts(2339)
              myElement.style.opacity = 1;
            } else {
              // Element is outside the viewport
              // Make the element invisible
              // @ts-expect-error: Property 'style' does not exist on type 'never'.ts(2339)
              myElement.style.opacity = 0;
            }
          }
        });
      },
      { threshold: 0.5 },
    ); // Adjust the threshold as needed
    if (myElement) {
      observer.observe(myElement);
    }

    // Cleanup the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myElementRef.current]); // Empty dependency array ensures the effect runs only once on mount

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading((_) => true);
    httpClient
      .post("blog/communities", { ...form, community }, { headers })
      .then((res) => {
        next?.(res.data);
        setForm({ name: "", content: "" });
      })
      .catch((err) => {
        setResponse(err.response);
      })
      .finally(() => setLoading((_) => false));
  };

  return (
    <form
      name="question-form"
      className="relative overflow-hidden rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-inset ring-gray-200"
      ref={myElementRef}
      onSubmit={onSubmit}
      style={{ transition: "opacity 0.5s" }}
    >
      <div className="">
        <label htmlFor="title" className="sr-only">
          Community
        </label>
        <input
          required
          minLength={8}
          type="text"
          name="name"
          id="name"
          onChange={onChange}
          value={form.name}
          className="block w-full border-0 px-2 py-2.5 text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0"
          placeholder="Community"
        />
        <label htmlFor="description" className="sr-only">
          Content
        </label>
        <textarea
          required
          minLength={8}
          rows={3}
          name="content"
          id="content"
          onChange={onChange}
          value={form.content}
          className="block w-full resize-none border-0 px-2 pb-5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="What is the question about..."
        />
      </div>

      <div className="mt-2 flex items-center justify-end">
        {/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          {loading ? (
            <ScaleLoader
              className="[&>span]:!h-3.5 [&>span]:!w-0.5"
              color="#fff"
            />
          ) : (
            <span>Ask</span>
          )}
        </button>
      </div>
    </form>
  );
}
