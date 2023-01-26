import { ChangeEventHandler } from "react";

export default function FormCheckBox({
  id,
  name,
  className,
  children,
  checked,
  onChange,
  error,
}: {
  id: string;
  name: string;
  className?: string;
  children?: JSX.Element;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
}) {
  return (
    <div className="block">
      <div className="flex flex-wrap lg:flex-nowrap items-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${className}`}
          checked={checked}
          onChange={onChange}
        />
        {children}
      </div>
      <h3 className="text-sm font-medium text-red-600 mt-1">{error}</h3>
    </div>
  );
}
