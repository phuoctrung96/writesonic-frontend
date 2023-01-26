import { ChangeEventHandler } from "react";
import FormLabel from "./formLabel";

export default function FormInput({
  id,
  name,
  label,
  type,
  autoComplete,
  required,
  placeholder,
  className,
  value,
  error,
  onChange,
}: {
  id?: string;
  name?: string;
  label?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  value?: string;
  error?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-400 focus:border-transparent text-sm"
          value={value}
          onChange={onChange}
        />
      </div>
      <h3 className="text-sm font-medium text-red-600 mt-1">{error}</h3>
    </div>
  );
}
