import { MouseEventHandler } from "react";

export default function RadioButton({
  htmlFor,
  label,
  name,
  id,
  checked,
  onClick,
}: {
  htmlFor?: string;
  label: string | JSX.Element;
  name?: string;
  id?: string;
  placeholder?: string;
  autoComplete?: string;
  checked?: boolean;
  onClick?: MouseEventHandler;
}) {
  return (
    <div className="flex items-center" onClick={onClick}>
      <input
        id={id}
        name={name}
        type="radio"
        className="focus:ring-indigo-500 text-indigo-600 border-gray-300 text-sm"
        checked={checked}
        onChange={() => {}}
      />
      <label
        htmlFor={htmlFor}
        className="ml-3 block text-base font-medium text-gray-700 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
