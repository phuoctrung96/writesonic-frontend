import { SearchIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SearchInput({
  className,
  initValue,
  onChange,
  placeholder,
}: {
  className?: string;
  initValue: string;
  onChange: Function;
  placeholder?: string;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
      className={`w-full flex md:ml-0 ${className} relative  justify-center items-center text-sidebar focus-within:text-black`}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
      </div>
      <input
        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-400 focus:border-transparent text-sm text-gray-700"
        placeholder={placeholder}
        type="text"
        autoComplete="off"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
    </div>
  );
}
