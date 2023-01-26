import classNames from "classnames";
import { useEffect, useState } from "react";
import SearchInput from "../searchInput";

export interface BusinessUsageSummaryProps {
  content_name: string;
  funds: number;
  generations?: number;
  rate?: number;
}

const BusinessUsageSummary: React.FC<{ costs: BusinessUsageSummaryProps[] }> =
  ({ costs }) => {
    const [searchKey, setSearchKey] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState<
      BusinessUsageSummaryProps[]
    >([]);

    useEffect(() => {
      setFilteredItems(
        costs.filter(({ content_name }) =>
          content_name.toLowerCase().includes(searchKey.toLocaleLowerCase())
        )
      );
    }, [costs, searchKey]);

    return (
      <>
        <div>
          <SearchInput
            initValue={searchKey}
            onChange={setSearchKey}
            placeholder="search for content type"
          />
        </div>
        <div className="mt-5 flex flex-col overflow-y-auto max-h-80">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Content Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Cost
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Generations
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems?.map(
                ({ content_name, funds, generations, rate }, index) => {
                  return (
                    <tr key={content_name} className="bg-white">
                      <td
                        className={classNames(
                          "px-6 py-4 text-sm",
                          index === 0
                            ? "font-bold text-gray-800 text-medium"
                            : "text-gray-500 text-sm"
                        )}
                      >
                        {content_name}
                      </td>
                      <td
                        className={classNames(
                          "px-6 py-4 text-sm",
                          index === 0
                            ? "font-bold text-gray-800 text-medium"
                            : "text-gray-500 text-sm"
                        )}
                      >
                        {`$ ${funds}`}
                      </td>
                      {typeof generations === "number" && (
                        <td
                          className={classNames(
                            "px-6 py-4 text-sm",
                            index === 0
                              ? "font-bold text-gray-800 text-medium"
                              : "text-gray-500 text-sm"
                          )}
                        >
                          {generations}
                        </td>
                      )}
                      {typeof rate === "number" && (
                        <td
                          className={classNames(
                            "px-6 py-4 text-sm",
                            index === 0
                              ? "font-bold text-gray-800 text-medium"
                              : "text-gray-500 text-sm"
                          )}
                        >
                          {`$ ${rate}`}
                        </td>
                      )}
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

export default BusinessUsageSummary;
