import classNames from "classnames";
import { forwardRef, MouseEventHandler } from "react";

interface XsWhiteButtonInterface {
  className?: string;
  children?: React.ReactNode | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  hideLoading?: boolean;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
}

const XsWhiteButton = forwardRef<HTMLButtonElement, XsWhiteButtonInterface>(
  (
    { className = "", children, onClick, disabled, hideLoading, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNames(
          disabled ? "cursor-not-allowed" : "hover:bg-gray-50",
          "transition-all duration-150 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700  bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 relative",
          className
        )}
        onClick={onClick}
        onMouseDown={props?.onMouseDown}
        disabled={disabled}
      >
        {children}
        {!hideLoading && disabled && (
          <svg
            className="animate-spin h-5 w-5 text-pink-0 pointer-events-none ml-3"
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
        )}
      </button>
    );
  }
);

XsWhiteButton.displayName = "XsWhiteButton";

export default XsWhiteButton;
