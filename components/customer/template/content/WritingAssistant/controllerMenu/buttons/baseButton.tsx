import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";

const BaseButton: React.FC<{
  children?: ReactNode;
  className?: string;
  name: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}> = ({ children, className = "", name, onClick, disabled }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        disabled
          ? "cursor-not-allowed"
          : "cursor-pointer hover:shadow-lg hover:text-indigo-800",
        "text-sm text-indigo-600 font-normal w-full px-4 py-3 flex justify-center items-center",
        className
      )}
    >
      <div>{children}</div>
      <p className="ml-2 text-gray-800 select-none">{name}</p>
    </div>
  );
};

export default BaseButton;
