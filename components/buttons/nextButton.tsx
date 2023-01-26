import useTranslation from "next-translate/useTranslation";
import { MouseEventHandler } from "react";

export default function NextButton({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  const { t } = useTranslation();
  return (
    <button
      className="transition-opacity duration-300 mt-5 sm:mt-0 ml-auto sm:ml-3 transition py-2.5 px-3 rounded-md  shadow-sm not-italic text-xs bg-white font-medium text-gray-700 focus:outline-none border border-gray-2 whitespace-nowrap focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={onClick}
    >
      {t("inputs:Next_Step")}
    </button>
  );
}
