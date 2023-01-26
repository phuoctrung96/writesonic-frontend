import { SearchIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { ChangeEventHandler } from "react";

export default function SearchBar({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  const { t } = useTranslation();
  return (
    <div className={`w-full flex md:ml-0 ${className && className}`}>
      <label htmlFor="search_field" className="sr-only">
        {t("inputs:search")}
      </label>
      <div className="relative w-full mx-3 text-sidebar focus-within:text-white">
        <input
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-400 focus:border-transparent text-sm text-gray-800"
          placeholder={t("inputs:search")}
          type="text"
          autoComplete="off"
          value={value}
          onChange={onChange}
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
