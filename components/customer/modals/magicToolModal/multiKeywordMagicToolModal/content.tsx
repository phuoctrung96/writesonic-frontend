import Link from "next/link";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { connect, useDispatch } from "react-redux";
import {
  searchRephrase,
  SemrushSearchOutput,
} from "../../../../../api/semrush";
import { setIsAuthorizedBySemrush } from "../../../../../store/user/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import SmPinkButton from "../../../../buttons/smPinkButton";
import Intent from "../intent";
import TableHeader from "../tableHeader";
import FormContent from "./formContent";

const MAX_NUM_KEYWORD = 2;

const Content: React.FC<{
  defaultSearchKey: string;
  onSelectKeywords: (primary: string, secondary: string) => void;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthorizedBySemrush: boolean;
  data: SemrushSearchOutput;
  setData: Dispatch<SetStateAction<SemrushSearchOutput>>;
}> = ({
  defaultSearchKey,
  onSelectKeywords,
  setIsOpenModal,
  isAuthorizedBySemrush,
  data,
  setData,
}) => {
  const dispatch = useDispatch();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const mounted = useRef(false);
  const [err, setError] = useState<string>("");
  const [filterColumnIndex, setFilterColumnIndex] = useState<number>(null);
  const [isAscending, setIsAscending] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [errMessage, setErrorMessage] = useState<string>(null);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const search = useCallback(
    async (searchKey, databaseCode, keywordType) => {
      if (!searchKey) {
        return;
      }
      try {
        setIsSearching(true);
        const res = await searchRephrase({
          search_key: searchKey,
          database_code: databaseCode,
          keyword_type: keywordType,
        });
        if (mounted.current) {
          setData(res);
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(setIsAuthorizedBySemrush(false));
        } else {
          setError(getErrorMessage(err));
        }
      } finally {
        if (mounted.current) {
          setIsSearching(false);
        }
      }
    },
    [dispatch, setData]
  );

  useEffect(() => {
    if (defaultSearchKey && data === null) {
      search(defaultSearchKey, "us", "phrase_fullsearch");
    }
  }, [data, defaultSearchKey, search]);

  const onSelect = () => {
    if (!selectedRows?.length || selectedRows?.length > MAX_NUM_KEYWORD) {
      setErrorMessage(`Please select up to ${MAX_NUM_KEYWORD} keywords.`);
      return;
    }
    const primary = data?.rows[selectedRows[0]][0] ?? "";
    const secondary = data?.rows
      ?.filter((value, index) =>
        selectedRows?.find((val, idx) => idx > 0 && val === index)
      )
      .map((row) => row[0])
      .join(", ");
    onSelectKeywords(primary, secondary);
    setIsOpenModal(false);
  };

  function GetSortAscOrder() {
    return function (a, b) {
      if (filterColumnIndex === null) {
        return 0;
      } else if (
        parseFloat(a[filterColumnIndex]) > parseFloat(b[filterColumnIndex])
      ) {
        return -1;
      } else if (
        parseFloat(a[filterColumnIndex]) < parseFloat(b[filterColumnIndex])
      ) {
        return 1;
      }
      return 0;
    };
  }

  function GetSortDesOrder() {
    return function (a, b) {
      if (filterColumnIndex === null) {
        return 0;
      } else if (
        parseFloat(a[filterColumnIndex]) < parseFloat(b[filterColumnIndex])
      ) {
        return -1;
      } else if (
        parseFloat(a[filterColumnIndex]) > parseFloat(b[filterColumnIndex])
      ) {
        return 1;
      }
      return 0;
    };
  }

  const onSelected = (checked: boolean, index) => {
    if (checked && selectedRows.find((idx) => idx === index) === undefined) {
      setSelectedRows([...selectedRows, index]);
    } else {
      setSelectedRows(selectedRows.filter((idx) => idx !== index));
    }
  };

  return (
    <div className="overflow-x-auto">
      <FormContent
        defaultSearchKey={defaultSearchKey}
        handleSearch={search}
        isSearching={isSearching}
      />
      {!!err ? (
        <p className="mt-3 text-center text-red-700 text-sm font-bold underline">
          {err}
        </p>
      ) : (
        <>
          {!isAuthorizedBySemrush ? (
            <Link href="/settings/integrations">
              <a>
                <p className="mt-3 text-center text-red-700 text-sm font-bold underline">
                  Please connect with SEMrush again.
                </p>
              </a>
            </Link>
          ) : (
            <>
              {!!data && (
                <div className="shadow border-b border-gray-200 sm:rounded-lg overflow-auto max-h-96 mt-5">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <TableHeader
                        data={data}
                        filterColumnIndex={filterColumnIndex}
                        setFilterColumnIndex={setFilterColumnIndex}
                        isAscending={isAscending}
                        setIsAscending={setIsAscending}
                      />
                    </thead>
                    <tbody>
                      {data?.rows
                        ?.sort(
                          isAscending ? GetSortAscOrder() : GetSortDesOrder()
                        )
                        ?.map((row, rowIdx) => (
                          <tr
                            key={rowIdx}
                            className={
                              rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            {row?.map((columnData, columnIdx) => {
                              switch (columnIdx) {
                                case 1:
                                  return (
                                    <td
                                      key={columnIdx}
                                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                    >
                                      <Intent data={columnData?.split(",")} />
                                    </td>
                                  );
                                // case 6:
                                //   return (
                                //     <td
                                //       key={columnIdx}
                                //       className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                //     >
                                //       <TrendLine
                                //         trends={columnData?.split(",")}
                                //       />
                                //     </td>
                                //   );
                                default:
                                  return (
                                    <td
                                      key={columnIdx}
                                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                    >
                                      <span>{columnData}</span>
                                    </td>
                                  );
                              }
                            })}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <input
                                id="candidates"
                                aria-describedby="candidates-description"
                                name="candidates"
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={
                                  selectedRows.find((idx) => idx === rowIdx) !==
                                  undefined
                                }
                                onChange={(e) =>
                                  onSelected(e.target.checked, rowIdx)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}
      <div>
        {!!errMessage && (
          <p className="mt-5 text-right text-red-700 text-md">{errMessage}</p>
        )}
        <SmPinkButton
          className="ml-auto mt-5 mb-1 mr-2"
          hideLoading={true}
          onClick={onSelect}
        >
          Use selected keywords
        </SmPinkButton>
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    isAuthorizedBySemrush: state.user?.is_authorized_by_semrush ?? false,
  };
};

export default connect(mapStateToPros)(Content);
