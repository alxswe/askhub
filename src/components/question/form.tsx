/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import TailwindAlert from "../alert/http";
import { useAxiosResponse } from "../client/hook";
import DynamicForm from "../form";
import Editor from "../layout/markdown/Editor";
import { IQuestion } from "./list";

interface FloatingQuestionFormProps<T> {
  element: T | Partial<T> | null;
  open: boolean;
  communityId?: any;
  setOpen: (...args: any) => any;
  next: (...args: any) => any;
}

export function FloatingQuestionForm({
  element,
  open,
  communityId,
  setOpen,
  next,
}: FloatingQuestionFormProps<IQuestion>) {
  const [state, setState] = useState<Partial<IQuestion> | null>({ ...element });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useAxiosResponse();

  useEffect(() => {
    if (!open) {
      setState((prev) => ({}));
    } else {
      setState((prev) => ({ ...prev, ...element }));
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

    const data = { ...state, communityId: communityId };
    let res;
    if (data.id) {
      res = await fetch("/api/questions/" + data.id, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      res = await fetch("/api/questions/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    }

    if (res.ok) {
      const dt = await res.json();
      next(dt);
    } else {
      setResponse(res);
    }

    setLoading((_) => false);
  };

  const fields = [
    {
      name: "name",
      label: "Question",
      as: "input",
      inputProps: {
        type: "text",
        required: true,
        minLength: 8,
        placeholder: "Provide a name for your question",
      },
    },
    {
      name: "content",
      label: "Content",
      as: "textarea",
      inputProps: {
        rows: "2",
        required: true,
        minLength: 8,
        placeholder: "State what is this question is about",
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
                  className="pb-5 text-lg font-medium text-gray-900"
                >
                  {state?.id ? "Update" : "New"} Question
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

interface QuestionFormProps {
  next: (...args: any) => any;
  communityId?: any;
}

export function QuestionForm({ next, communityId }: QuestionFormProps) {
  const [response, setResponse] = useAxiosResponse();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    content: "",
    communityId: communityId,
  });

  const onChange = (e: React.FormEvent<any>) => {
    const { currentTarget } = e,
      { name, value } = currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading((_) => true);

    const data = { ...form, communityId: communityId };

    const res = await fetch("/api/questions/", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const dt = await res.json();
      next(dt);
      setForm({ name: "", content: "", communityId: communityId });
    } else {
      setResponse(res);
    }

    setLoading((_) => false);
  };

  return (
    <>
      <TailwindAlert error={response} />
      <form
        name="question-form"
        className="relative overflow-hidden rounded-lg bg-white p-3 shadow-sm ring-1 ring-inset ring-gray-200"
        onSubmit={onSubmit}
      >
        <div className="">
          <label htmlFor="title" className="sr-only">
            Question
          </label>
          <input
            required
            minLength={3}
            type="text"
            name="name"
            id="name"
            onChange={onChange}
            value={form.name}
            className="block w-full border-0 px-2 py-2.5 text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0"
            placeholder="Question"
          />
          <div>
            <Editor
              initialDoc={form.content}
              onChange={(content: string) =>
                setForm((prev) => ({ ...prev, content: content }))
              }
            />
          </div>
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
    </>
  );
}
