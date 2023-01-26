import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  CreditHistoryInterfacePerType,
  getAllForThisMonthPerType,
} from "../../../../../api/admin/creditHistory";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import Overlay from "../../../../customer/overlay";
import Table from "../../table";

const columns = [
  "feature name",
  "total cost",
  "total Generations",
  "avg, cost per generation",
];

export default function MonthTable() {
  const mounted = useRef(false);
  const router = useRouter();
  const [data, setData] = useState<CreditHistoryInterfacePerType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  async function init(nextPage) {
    try {
      setIsLoading(true);
      const { items, total, page, size } = await getAllForThisMonthPerType(
        nextPage
      );
      if (!mounted.current) {
        return;
      }
      setTotal(total);
      setPage(page);
      setSize(size);
      let updated = [];
      items.forEach((item) => {
        let updatedItem = {};
        Object.keys(item).forEach((key) => {
          if (key !== "id") {
            updatedItem[key] = {
              value: item[key],
            };
          }
          switch (key) {
            case "id":
              updatedItem[key] = item["id"];
              break;
            case "content_name":
              updatedItem[key] = {
                ...updatedItem[key],
                className: "text-gray-900 font-medium",
              };
              break;
            case "total_cost":
              updatedItem[key] = {
                ...updatedItem[key],
                className: "text-gray-500 font-normal",
                value: "$" + updatedItem[key].value,
              };
              break;
            case "total_generation":
              updatedItem[key] = {
                ...updatedItem[key],
                className: "text-gray-500 font-normal",
              };
              break;
            case "avg_cost":
              updatedItem[key] = {
                ...updatedItem[key],
                className: "text-gray-500 font-normal",
                value: "$" + updatedItem[key].value,
              };
              break;
          }
        });
        updated.push(updatedItem);
      });
      setData(updated);
      setIsLoading(false);
    } catch (err) {
      const errorCode = err.response?.status;
      const errorDetail = err.response?.data?.detail;
      if (errorCode === 406 && errorDetail === "You don't have permission") {
        router.push("/", undefined, { shallow: true });
      }
    }
  }

  useEffect(() => {
    init(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPrevious = () => {
    if (page < 2) {
      return;
    }
    init(page - 1);
  };

  const onNext = () => {
    if (page >= Math.ceil(total / size)) {
      return;
    }
    init(page + 1);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        <p className="font-normal text-md text-black">
          OpenAI Expenditure Per Content Type This Month (Till date)
        </p>
        <div className="flex">
          <p className="max-w-max text-gray-900 hover:text-gray-700 rounded-l-lg group relative flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:shadow focus:shadow-none border border-gray-200 focus:z-10 cursor-pointer select-none">
            Filter
          </p>
          <p className="max-w-max text-gray-900 hover:text-gray-700 rounded-r-lg group relative flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:shadow focus:shadow-none border border-gray-200 focus:z-10 cursor-pointer select-none">
            1
          </p>
        </div>
      </div>
      <div className="mt-5 relative">
        <Table columns={columns} data={data} />
        <Overlay hideLoader isShowing={isLoading} />
      </div>
      <div className="block sm:flex sm:justify-between sm:items-center mt-6">
        {data.length > 0 && (
          <p className="font-normal text-sm text-gray-600">
            Showing <span className="font-bold">{page}</span> to{" "}
            <span className="font-bold">{Math.ceil(total / size)}</span> of
            <span className="ml-2 font-bold">{total}</span> results
          </p>
        )}
        <div className="flex items-center">
          <SmWhiteButton
            className={classNames(
              page < 2 ? "focus:ring-red-400" : "focus:ring-gray-300"
            )}
            onClick={onPrevious}
          >
            Previous
          </SmWhiteButton>
          <SmWhiteButton
            className={classNames(
              page >= Math.ceil(total / size)
                ? "focus:ring-red-400"
                : "focus:ring-gray-300",
              "ml-3"
            )}
            onClick={onNext}
          >
            Next
          </SmWhiteButton>
        </div>
      </div>
    </div>
  );
}
