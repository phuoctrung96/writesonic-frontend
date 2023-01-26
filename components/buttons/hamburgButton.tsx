import { MenuAlt2Icon } from "@heroicons/react/outline";
import classNames from "classnames";
import { MouseEventHandler } from "react";

interface HamburgButtonInterface {
  className?: string;
  children?: React.ReactNode | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  hideLoading?: boolean;
}

const HamburgButton: React.FC<HamburgButtonInterface> = ({
  className = "",
  onClick,
  disabled,
}) => {
  return (
    <button
      className={classNames(
        disabled ? "cursor-not-allowed" : "hover:bg-gray-50",
        "transition-all duration-150 inline-flex items-center px-4 border border-transparent text-xs font-medium rounded text-gray-700  bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="sr-only">Open sidebar</span>
      <MenuAlt2Icon width={24} height={50} aria-hidden="true" />
    </button>
  );
};

export default HamburgButton;
