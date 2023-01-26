import { ArrowLeftIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { MouseEventHandler } from "react";

interface SmBackButtonInterface {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const SmBackButton: React.FC<SmBackButtonInterface> = ({
  className = "",
  onClick,
  disabled,
}) => {
  const { t } = useTranslation();
  return (
    <button
      className={classNames(
        disabled ? "cursor-not-allowed" : "",
        "transition-all duration-150 flex justify-center items-center transition flex justify-center p-0.5 rounded-md not-italic text-sm font-sm text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-200",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="sr-only">{t("common:Close_panel")}</span>
      <ArrowLeftIcon width={25} height={25} aria-hidden="true" />
    </button>
  );
};

export default SmBackButton;
