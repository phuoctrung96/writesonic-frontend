import { Transition } from "@headlessui/react";
import { useEffect, useRef } from "react";
import { ArticleOutlineText } from "../template/content/AiArticleWriterV2";

export default function TextArea({
  htmlFor,
  label,
  autoComplete,
  rows = 3,
  value,
  onChange,
  className,
  placeholder,
  error,
  disabled,
  articleOutlineTexts,
}: {
  htmlFor?: string;
  label?: string | JSX.Element;
  autoComplete?: string;
  rows?: number;
  placeholder?: string;
  value?: string | string[];
  onChange?: Function;
  className?: string;
  error?: string;
  disabled?: boolean;
  articleOutlineTexts?: ArticleOutlineText[];
}) {
  const multilineTextarea = useRef<HTMLTextAreaElement>(null);
  const changeTextarea = () => {
    multilineTextarea.current.style.height = "auto";
    multilineTextarea.current.style.height =
      Math.min(multilineTextarea.current.scrollHeight, 304) + "px";
  };
  useEffect(() => {
    changeTextarea();
  }, [articleOutlineTexts]);
  return (
    <>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="mt-1 relative">
        <textarea
          ref={multilineTextarea}
          rows={rows}
          autoComplete={autoComplete}
          // style={{ resize: "none" }}
          data-gramm_editor="false"
          className={`${className} appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent text-base`}
          value={value}
          placeholder={placeholder}
          onChange={({ target }) => {
            onChange(target.value);
            // changeTextarea();
          }}
          disabled={disabled}
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
      {error && (
        <h3 className="text-base font-medium text-red-600 mt-1">{error}</h3>
      )}
    </>
  );
}
