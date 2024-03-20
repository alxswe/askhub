import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

export default function DeleteNotification({
  show,
  setShow,
  callback,
}: {
  show: boolean;
  setShow: (...args: any) => void;
  callback: (...args: any) => void;
}) {
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-end sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="flex items-center divide-x divide-gray-200">
                <div className="flex w-0 flex-1 items-center justify-between p-4">
                  <p className="w-0 flex-1 text-sm font-semibold text-gray-900">
                    Are you sure you want to delete this record?
                  </p>
                </div>
                <div className="ml-4 flex flex-shrink-0 flex-col divide-y divide-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={callback}
                    className="inline-flex items-center justify-center bg-white px-3.5 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 focus:outline-none"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  </button>
                  <button
                    autoFocus
                    type="button"
                    onClick={() => setShow()}
                    className="inline-flex items-center justify-center bg-white px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:animate-pulse focus:outline-none"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
