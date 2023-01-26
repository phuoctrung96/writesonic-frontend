import { Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import ToolTip from "./tooltip/muiToolTip";

export default function CountTextInput({
  value,
  onChange,
  error,
  maxLength,
  children,
  disabled,
  label,
  leftLabel,
  required,
  placeholder,
  tooltip,
}: {
  value?: string;
  onChange?: Function;
  error?: string;
  maxLength?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  label?: string;
  leftLabel?: string;
  required?: boolean;
  placeholder?: string;
  tooltip?: string;
}) {
  return (
    <>
      <div className="flex justify-between items-center relative w-full">
        <div className="flex flex-wrap mb-1 text-base items-center ">
          <label className="block text-base font-medium text-gray-700">
            {label}
          </label>
          {tooltip && (
            <ToolTip message={tooltip} position="top">
              <InformationCircleIcon className="ml-1 w-4 h-4 text-gray-500" />
            </ToolTip>
          )}
          {required && <span className="ml-1 text-red-500">*</span>}
          {children}
        </div>
        {maxLength && (
          <p
            className={`text-xs text-${
              value?.length < maxLength ? "gray-400" : "red-500"
            }`}
          >
            {value?.length ?? 0} / {maxLength}
          </p>
        )}
      </div>
      <div className="flex items-center">
        {!!leftLabel && (
          <p className="text-xs text-gray-600 mr-2 whitespace-nowrap">
            {leftLabel}:
          </p>
        )}
        <div className="relative w-full">
          <input
            value={value}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent text-base"
            onChange={({ target }) => {
              if (onChange) {
                onChange(
                  target.value?.length > maxLength
                    ? target.value?.substring(0, maxLength)
                    : target.value
                );
              }
            }}
            placeholder={placeholder}
          />
          <Transition
            show={!!disabled}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-20" />
          </Transition>
        </div>
      </div>
      {error && (
        <h3 className="text-base font-medium text-red-600 mt-1">{error}</h3>
      )}
    </>
  );
}
