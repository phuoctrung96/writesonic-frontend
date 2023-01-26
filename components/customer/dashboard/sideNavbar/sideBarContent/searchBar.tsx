import { SearchIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SearchBar({
  className,
  initValue,
  onChange,
}: {
  className?: string;
  initValue: string;
  onChange: Function;
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [key, setKey] = useState(initValue);
  useEffect(() => {
    const id = setTimeout(() => {
      onChange(key);
    }, 300);
    return () => {
      clearTimeout(id);
    };
  }, [dispatch, key, onChange]);
  return (
    <div
      className={`w-full flex md:ml-0 ${className} justify-center items-center text-sidebar focus-within:text-black`}
    >
      <input
        className="font-medium text-sm bg-transparent block w-full h-full px-2 pr-10 py-2 border-transparent text-black placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
        placeholder={t("inputs:search")}
        type="text"
        autoComplete="off"
        value={key}
        autoFocus={true}
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
      <div className="flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
      </div>
    </div>
  );
}
