import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { Dispatch, SetStateAction } from "react";
import ToolTip from "../../../tooltip/muiToolTip";

const ColumnContent: React.FC<{
  index: number;
  columnName: string;
  filterColumnIndex: number;
  setFilterColumnIndex: (value: SetStateAction<number>) => void;
  isAscending: boolean;
  setIsAscending: Dispatch<SetStateAction<boolean>>;
}> = ({
  index,
  columnName,
  filterColumnIndex,
  setFilterColumnIndex,
  isAscending,
  setIsAscending,
}) => {
  const handleClick = (index: number) => {
    setFilterColumnIndex(index);
    if (index === filterColumnIndex) {
      setIsAscending(!isAscending);
    }
  };

  let message = "";
  switch (index) {
    case 1:
      message =
        "The purpose of a search in a search engine. Intents can be read by the search engine algorithms to show the proper results and SERP features.";
      break;
    case 2:
      message = "";
      break;
    case 3:
      message =
        "Average price in USD advertisers pay for a user's click on an ad triggered by a given keyword (Google Ads). Use sort icon to display results in ascending or descending order.";
      break;
    case 4:
      message =
        "The level of competition between advertisers bidding on a given keyword within their PPC campaigns. Competitive Density is shown on a scale from 0 to 1.00 with 1.00 being the most difficult to rank for.";
      break;
  }
  if (index === 2 || index === 3 || index === 4 || index === 5) {
    return (
      <ToolTip message={message} position="top">
        <div
          className="flex items-center px-6 py-3 text-center"
          onClick={() => handleClick(index)}
        >
          <p className="text-center">{columnName}</p>
          {filterColumnIndex === index && (
            <div className="ml-2">
              {isAscending ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </div>
          )}
        </div>
      </ToolTip>
    );
  } else if (message) {
    return (
      <ToolTip message={message} position="top">
        <p className="px-6 py-3 text-center">{columnName}</p>
      </ToolTip>
    );
  }
  return <p className="text-center">{columnName}</p>;
};

export default ColumnContent;
