import { useState } from "react";
import SmPinkButton from "../../../../buttons/smPinkButton";
import CountryDropDown from "../../../../countryDropDown";
import TextInput from "../../../../textInput";

interface FormContentProps {
  defaultSearchKey: string;
  handleSearch: (key: string, databaseCode: string, keywordType: string) => {};
  isSearching: boolean;
}

const FormContent: React.FC<FormContentProps> = ({
  defaultSearchKey,
  handleSearch,
  isSearching,
}) => {
  const [searchKey, setSearchKey] = useState<string>(defaultSearchKey);
  const [databaseCode, setDatabaseCode] = useState<string>("us");
  const [searchType, setSearchType] = useState<string>("phrase_fullsearch");
  return (
    <>
      <div className="grid grid-cols-12 gap-2 p-2">
        <TextInput
          type="text"
          className="col-span-12 md:col-span-8 mt-0"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-x-2">
          <div className="col-span-1">
            <CountryDropDown value={databaseCode} onChange={setDatabaseCode} />
          </div>
          <SmPinkButton
            className="col-span-1"
            onClick={() => {
              handleSearch(searchKey, databaseCode, searchType);
            }}
            disabled={!searchKey.length || isSearching}
            hideLoading={true && !isSearching}
          >
            Search
          </SmPinkButton>
        </div>
      </div>
      <div className="grid p-2 justify-center">
        <fieldset className="mt-4">
          <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
            <div className="flex items-center">
              <p className="text-sm leading-5 text-gray-500">
                Search Keyword Type :
              </p>
            </div>
            <div className="flex items-center">
              <input
                id="broad_match"
                name="notification-method"
                type="radio"
                checked={searchType === "phrase_fullsearch" ? true : false}
                className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300"
                onChange={() => {
                  setSearchType("phrase_fullsearch");
                }}
              />
              <label
                htmlFor="broad_match"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Broad Match
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="related"
                name="notification-method"
                type="radio"
                className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300"
                onChange={() => {
                  setSearchType("phrase_related");
                }}
              />
              <label
                htmlFor="related"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Related
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};
export default FormContent;
