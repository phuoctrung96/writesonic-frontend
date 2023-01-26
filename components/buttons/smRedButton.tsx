import classNames from "classnames";
import { MouseEventHandler } from "react";

interface SmRedButtonInterface {
  className?: string;
  children?: React.ReactNode | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  hideLoading?: boolean;
}

const SmRedButton: React.FC<SmRedButtonInterface> = ({
  className = "",
  children,
  onClick,
  disabled,
  hideLoading,
}) => {
  return (
    <button
      className={classNames(
        disabled
          ? "cursor-not-allowed"
          : "hover:bg-opacity-85 hover:shadow-lg ",
        "transition-all duration-150 flex justify-center items-center transition flex justify-center py-2 px-4 border rounded-md shadow-sm not-italic text-sm font-medium text-white bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 border-pink-0 relative",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {!hideLoading && disabled && (
        <svg
          className="animate-spin h-5 w-5 text-gray-50 pointer-events-none ml-3"
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
      {!!disabled && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-20" />
      )}
    </button>
  );
};

export default SmRedButton;
