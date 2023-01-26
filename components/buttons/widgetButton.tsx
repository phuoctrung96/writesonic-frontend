import classNames from "classnames";
import { forwardRef, MouseEventHandler, ReactNode } from "react";

const WidgetButton = forwardRef<
  HTMLButtonElement,
  {
    onClick: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    disabled?: boolean;
  }
>(({ onClick, children, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={classNames(
        disabled ? "cursor-not-allowed" : "",
        "inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-3 bg-gray-2 bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? (
        <svg
          className="animate-spin h-5 w-5 text-pink-0"
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
  );
});

WidgetButton.displayName = "WidgetButton";

export default WidgetButton;
