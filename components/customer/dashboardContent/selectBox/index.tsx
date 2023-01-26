import { ChangeEventHandler, ReactNode } from "react";
import styles from "./index.module.scss";

const SelectBox: React.FC<{
  id?: string;
  name?: string;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  children: ReactNode;
  className?: string;
}> = ({ id, name, value, onChange, children, className }) => {
  return (
    <select
      id={id}
      name={name}
      className={`${className ?? ""} ${className?.includes(
        "mt-" ? "" : "mt-1"
      )} ${
        styles["select-wrapper"]
      } appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent text-base bg-inherit`}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
};

export default SelectBox;
