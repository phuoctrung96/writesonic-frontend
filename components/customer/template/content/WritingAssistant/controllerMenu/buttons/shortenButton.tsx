import { MouseEventHandler } from "react";
import BaseButton from "./baseButton";

const ShortenButton: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  isLoading: boolean;
  disabled?: boolean;
}> = ({ onClick, isLoading, disabled }) => {
  return (
    <BaseButton name="Shorten" onClick={onClick} disabled={disabled}>
      <div className="w-9 h-9 flex justify-center items-center">
        {isLoading ? (
          <svg
            width="36"
            height="36"
            className="animate-spin  h-7 w-7"
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
            <g clipPath="url(#clip0_1150:2651)">
              <path
                d="M25.5 16.75L25.5 15.5L21.3838 15.5L26.75 10.1363L25.8663 9.25L20.5 14.6162L20.5 10.5L19.25 10.5L19.25 16.75L25.5 16.75Z"
                fill="currentColor"
              />
              <path
                d="M9.25 25.865L10.13 26.75L15.5 21.3837L15.5 25.5L16.75 25.5L16.75 19.25L10.5 19.25L10.5 20.5L14.6163 20.5L9.25 25.865Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_1150:2651">
                <rect
                  width="20"
                  height="20"
                  fill="white"
                  transform="translate(8 8)"
                />
              </clipPath>
            </defs>
          </svg>
        )}
      </div>
    </BaseButton>
  );
};

export default ShortenButton;
