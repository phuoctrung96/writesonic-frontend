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
          disabled={!searchKey?.length || isSearching}
          hideLoading={true && !isSearching}
        >
          Search
        </SmPinkButton>
      </div>
    </div>
  );
};
export default FormContent;
