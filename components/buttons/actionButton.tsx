import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";
import ToolTip from "../tooltip/muiToolTip";

export default function ActionButton({
  className = "",
  children,
  onClick,
  isLoading,
  disabled,
  tooltipMessage,
  tooltipPosition,
}: {
  className?: string;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  disabled?: boolean;
  tooltipMessage?: string;
  tooltipPosition?: any;
}) {
  return (
    <ToolTip
      message={tooltipMessage ? tooltipMessage : ""}
      position={tooltipPosition}
    >
      <button
        className={classNames(
          "flex justify-center transition py-2.5 px-3 rounded-md  shadow-sm not-italic text-sm bg-white font-medium text-gray-700 focus:outline-none border border-gray-2 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300",
          className
        )}
        onClick={onClick}
        disabled={isLoading || !!disabled}
      >
        {isLoading ? (
          <svg
            className={`animate-spin h-5 w-5 text-pink-0`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          children
        )}
      </button>
    </ToolTip>
  );
}
