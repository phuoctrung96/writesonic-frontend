import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";

const ToolItem: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
  selected?: boolean;
  className?: string;
}> = ({ onClick, children, selected, className = "" }) => {
  return (
    <div
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={classNames(
        "hover:text-gray-500 px-0.5 xs:px-1 py-2.5 lg:py-1 cursor-pointer",
        selected ? "bg-gray-200 rounded-md text-gray-600" : "text-gray-400",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ToolItem;
