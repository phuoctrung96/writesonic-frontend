import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";

export default function NavigationButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <button
      className={classNames(
        disabled ? "focus:ring-red-600" : "focus:ring-blue-600",
        "transition py-2 px-2 rounded-md  shadow-sm not-italic text-sm bg-white font-medium text-gray-700 focus:outline-none border border-gray-2 focus:ring-2 focus:ring-offset-2"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
