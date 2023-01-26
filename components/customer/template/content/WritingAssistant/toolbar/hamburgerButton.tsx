import classNames from "classnames";
import { MouseEventHandler } from "react";

const HamburgerButton: React.FC<{
  onClick: MouseEventHandler<HTMLDivElement>;
  active: boolean;
}> = ({ onClick, active }) => {
  return (
    <div
      className={classNames(
        "cursor-pointer max-w-min",
        active
          ? "text-gray-800 hover:text-gray-600"
          : "text-gray-300 hover:text-gray-400"
      )}
      onClick={onClick}
    >
      <svg
        className="hidden lg:block"
        width="22"
        height="18"
        viewBox="0 0 22 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 0H2C1.60218 0 1.22064 0.158035 0.93934 0.43934C0.658035 0.720644 0.5 1.10218 0.5 1.5V16.5C0.5 16.8978 0.658035 17.2794 0.93934 17.5607C1.22064 17.842 1.60218 18 2 18H20C20.3978 18 20.7794 17.842 21.0607 17.5607C21.342 17.2794 21.5 16.8978 21.5 16.5V1.5C21.5 1.10218 21.342 0.720644 21.0607 0.43934C20.7794 0.158035 20.3978 0 20 0ZM20 16.5H8V1.5H20V16.5Z"
          fill="currentColor"
        />
      </svg>
      <p className="block lg:hidden text-gray-2 text-sm whitespace-nowrap">
        <span className="block xs:hidden">Input</span>
        <span className="hidden xs:block">Input Data</span>
      </p>
    </div>
  );
};

export default HamburgerButton;
