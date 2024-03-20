import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import DotLoader from "react-spinners/DotLoader";

export default function LoadingNotification({ show }: { show: boolean }) {
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-end sm:p-6"
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
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex w-0 flex-1 items-center justify-between">
                    <p className="w-0 flex-1 text-sm font-medium text-gray-900">
                      Loading
                    </p>
                    <DotLoader size={20} color="rgb(107 114 128)" />
                  </div>
                  <div className="ml-4 flex flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
