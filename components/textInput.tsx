import classNames from "classnames";
import { ChangeEventHandler, KeyboardEventHandler } from "react";

export default function TextInput({
  htmlFor,
  label,
  name,
  id,
  type,
  placeholder,
  autoComplete,
  error,
  info,
  onChange,
  onKeyDown,
  value,
  disabled,
  className,
  min,
  max,
  step,
}: {
  htmlFor?: string;
  label?: string | JSX.Element;
  name?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  info?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  value?: string;
  disabled?: boolean;
  className?: string;
  min?: string | number;
  max?: string | number;
  step?: number;
}) {
  return (
    <div className={classNames(className ? className : "", "block")}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-base font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div
        className={`${className && className.indexOf("mt") > 0 ? "" : "mt-1"} ${
          className && className
        }`}
      >
        <div>
          <input
            type={type}
            name={name}
            step={step}
            id={id}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent text-base"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={disabled}
            max={max}
            min={min}
          />
        </div>
      </div>
      {error && (
        <h3 className="text-sm font-medium text-red-600 mt-2">{error}</h3>
      )}
      {info && (
        <h3 className="text-sm font-medium text-green-600 mt-2">{info}</h3>
      )}
    </div>
  );
}
