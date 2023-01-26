import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  CreditHistoryThisMonth,
  getSummaryToday,
} from "../../../../../api/admin/creditHistory";
import getPercent from "../../../../../utils/getPercent";
import Overlay from "../../../../customer/overlay";
import EngineUsageCard from "./engineUsageCard";

export default function ExpenditureTodayPerEngine() {
  const mounted = useRef(false);
  const router = useRouter();
  const [data, setData] = useState<CreditHistoryThisMonth[]>([]);
  const [iseLoading, setIsLoading] = useState<boolean>(true);
  const [totalGenerations, setTotalGenerations] = useState<number>(0);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getSummaryToday()
      .then((res) => {
        if (!mounted.current) {
          return;
        }
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        const errorCode = err.response?.status;
        const errorDetail = err.response?.data?.detail;
        if (errorCode === 406 && errorDetail === "You don't have permission") {
          router.push("/", undefined, { shallow: true });
        }
      });
  }, [router]);

  useEffect(() => {
    let generations = 0;
    data.forEach(({ number_of_generation }) => {
      generations += number_of_generation;
    });
    setTotalGenerations(generations);
  }, [data]);

  return (
    <div className="relative">
      <p className="font-normal text-md text-black">
        OpenAI Expenditure Per Engine Today
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-3">
        {data?.map(({ open_ai_engine, total_cost, number_of_generation }) => {
          return (
            <div key={open_ai_engine}>
              <EngineUsageCard
                engineName={open_ai_engine}
                cost={total_cost}
                numberOfGeneration={number_of_generation}
                percent={getPercent(number_of_generation, totalGenerations)}
              />
            </div>
          );
        })}
      </div>
      <Overlay isShowing={iseLoading} hideLoader />
    </div>
  );
}
