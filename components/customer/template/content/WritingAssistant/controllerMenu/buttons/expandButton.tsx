import { MouseEventHandler } from "react";
import BaseButton from "./baseButton";

const ExpandButton: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  isLoading;
  disabled?: boolean;
}> = ({ onClick, isLoading, disabled }) => {
  return (
    <BaseButton name="Expand" onClick={onClick} disabled={disabled}>
      <div className="w-9 h-9 flex justify-center items-center">
        {isLoading ? (
          <svg
            width="36"
            height="36"
            className="animate-spin h-7 w-7"
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
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 18C0 1.62 1.62 0 18 0C34.38 0 36 1.62 36 18C36 34.38 34.38 36 18 36C1.62 36 0 34.38 0 18Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <path
              d="M20.5 9.25V10.5H24.6163L19.25 15.8637L20.1337 16.75L25.5 11.3837V15.5H26.75V9.25H20.5Z"
              fill="currentColor"
            />
            <path
              d="M16.75 20.135L15.87 19.25L10.5 24.6163V20.5H9.25V26.75H15.5V25.5H11.3837L16.75 20.135Z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
    </BaseButton>
  );
};

export default ExpandButton;
