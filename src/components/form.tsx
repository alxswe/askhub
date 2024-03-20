import { AxiosResponse } from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import TailwindAlert from "./alert/http";

interface Props<T> {
  initial: T | Partial<T> | null;
  loading: boolean;
  response: Response | AxiosResponse | null;
  fields: Record<string, any>[];
  onChange: (...args: any) => any;
  onSubmit: (...args: any) => any;
  cancel: (...args: any) => any;
}

const DynamicForm = <T,>({
  initial,
  loading,
  response,
  fields,
  onChange,
  onSubmit,
  cancel,
}: Props<T>) => {
  const renderFormFields = () => {
    return fields.map((field) => (
      <div
        key={field.name}
        className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600"
      >
        <label
          htmlFor={field.name}
          className="block text-xs font-medium text-gray-900"
        >
          {field.label}
        </label>
        {field.as === "select" ? (
          <select
            name={field.name}
            // @ts-expect-error: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type 'Partial<T> | (T & {})'.ts(7053)
            value={data === null ? null : initial[field.name]}
            onChange={onChange}
            disabled={field.options.length === 0}
            className="block w-full border-0 bg-white py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
            {...field.inputProps}
          >
            <option value="">Select an option</option>
            {/* @ts-expect-error: Parameter 'option' implicitly has an 'any' type.ts(7006) */}
            {field.options.map((option, index) => (
              <option key={index} value={option[field.valueKey]}>
                {option[field.labelKey]}
              </option>
            ))}
          </select>
        ) : field.as === "textarea" ? (
          <textarea
            name={field.name}
            // @ts-expect-error: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type 'Partial<T> | (T & {})'.ts(7053)
            value={initial[field.name]}
            onChange={onChange}
            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
            {...field.inputProps}
          />
        ) : (
          <input
            name={field.name}
            // @ts-expect-error: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type 'Partial<T> | (T & {})'.ts(7053)
            value={initial[field.name]}
            onChange={onChange}
            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
            {...field.inputProps}
          />
        )}
      </div>
    ));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-3">
        <TailwindAlert error={response} />
        {renderFormFields()}
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {cancel && (
          <button
            type="button"
            onClick={cancel}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {loading ? (
            <ScaleLoader
              className="[&>span]:!h-3.5 [&>span]:!w-0.5"
              color="#fff"
            />
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
