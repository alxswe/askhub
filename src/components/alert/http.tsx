import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const colors = {
  green: {
    Icon: CheckCircleIcon,
    iconClass: "text-green-400",
    textClass: "text-green-800",
    buttonClass:
      "bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50",
  },
  red: {
    Icon: XCircleIcon,
    iconClass: "text-red-400",
    textClass: "text-red-800",
    buttonClass:
      "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50",
  },
  yellow: {
    Icon: ExclamationTriangleIcon,
    iconClass: "text-yellow-400",
    textClass: "text-yellow-800",
    buttonClass:
      "bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50",
  },
  gray: {
    Icon: ExclamationTriangleIcon,
    iconClass: "text-gray-400",
    textClass: "text-gray-800",
    buttonClass:
      "bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-gray-600 focus:ring-offset-gray-50",
  },
};

const getColor = (status: number) => {
  if (status >= 500) {
    return "red";
  } else if (status >= 400) {
    return "yellow";
  } else if (status >= 200) {
    return "green";
  } else {
    return "gray";
  }
};

export default function TailwindAlert({
  error,
  className,
}: {
  className?: string;
  error: Response | AxiosResponse | null;
}) {
  const [Icon, setIcon] = useState<any>(QuestionMarkCircleIcon);
  const [iconClass, setIconClass] = useState("text-gray-400");
  const [textClass, setTextClass] = useState("text-gray-800");
  const [buttonClass, setButtonClass] = useState(
    "bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-gray-600 focus:ring-offset-gray-50",
  );

  useEffect(() => {
    if (!error) {
      return;
    }
    const color = getColor(error?.status);
    setIcon(colors[color].Icon);
    setIconClass(colors[color].iconClass);
    setTextClass(colors[color].textClass);
    setButtonClass(colors[color].buttonClass);
  }, [error]);

  return (
    <Transition
      show={!!error}
      className={`rounded-md p-4 ${buttonClass} ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClass}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textClass}`}>
            {/* @ts-expect-error: Property 'data' does not exist on type 'Response'.ts(2339) */}
            {error?.data?.detail ??
              // @ts-expect-error: Property 'data' does not exist on type 'Response'.ts(2339)
              error?.data?.__all__ ??
              // @ts-expect-error: Property 'data' does not exist on type 'Response'.ts(2339)
              error?.data?.non_field_errors ??
              error?.statusText}
          </p>
        </div>
      </div>
    </Transition>
  );
}
