import { SearchIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { setDashboardSearchKey } from "../../../store/main/actions";

function SearchBar({
  className,
  searchKey,
}: {
  className?: string;
  searchKey: string;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [key, setKey] = useState("");
  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(setDashboardSearchKey(key));
    }, 300);
    return () => {
      clearTimeout(id);
    };
  }, [dispatch, key]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const tmpKey = key;
      dispatch(setDashboardSearchKey(""));
      setTimeout(() => {
        dispatch(setDashboardSearchKey(tmpKey));
      }, 200);
    }
  };

  useEffect(() => {
    setKey(searchKey);
  }, [searchKey]);

  return (
    <div className={`w-full flex md:ml-0 ${className}`}>
      <label htmlFor="search_field" className="sr-only">
        {t("inputs:search")}
      </label>
      <div className="flex justify-center items-center w-full text-sidebar focus-within:text-black">
        <div className="flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        </div>
        <input
          className="font-medium text-sm bg-transparent block w-full h-full pl-2 pr-2 py-2 border-transparent text-black placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
          placeholder={t("inputs:search")}
          type="text"
          autoComplete="off"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

const mapStateToPros = (state) => {
  return { searchKey: state.main?.dashboardSearchKey ?? "" };
};

export default connect(mapStateToPros)(SearchBar);
