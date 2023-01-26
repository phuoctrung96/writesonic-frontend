import AnimatedNumber from "animated-number-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  getSummaryThisMonth,
  XCreditHistoryThisMonth,
} from "../../../../../api/admin/xCreditHistory";
import getPercent from "../../../../../utils/getPercent";
import Overlay from "../../../../customer/overlay";
import CountCard from "../../countCard";
import PriceCard from "../../priceCard";

export default function ExpenditureMonth() {
  const mounted = useRef(false);
  const router = useRouter();
  const [data, setData] = useState<XCreditHistoryThisMonth[]>([]);
  const [iseLoading, setIsLoading] = useState<boolean>(true);
  const [totalGenerations, setTotalGenerations] = useState<number>(0);
  const [totalCoast, setTotalCost] = useState<number>(0);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getSummaryThisMonth()
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
    let costs = 0;
    let generations = 0;
    data.forEach(({ total_cost, number_of_generation }) => {
      costs += total_cost;
      generations += number_of_generation;
    });
    setTotalCost(costs);
    setTotalGenerations(generations);
  }, [data]);

  return (
    <div>
      <p className="font-normal text-md text-black">
        OpenAI Expenditure This Month
      </p>
      <div className="relative">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-3">
          <PriceCard
            name="Total Cost"
            price={totalCoast}
            percent={getPercent(totalGenerations, totalGenerations)}
          />
          <CountCard
            name="Generations"
            value={totalGenerations}
            percent={getPercent(totalGenerations, totalGenerations)}
          />
        </div>
        <Overlay isShowing={iseLoading} hideLoader />
      </div>
      <p className="font-normal text-md text-black mt-8">
        OpenAI Expenditure Per Engine This Month
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-3">
        {data?.map(
          ({
            x_engine_id,
            x_engine_name,
            total_cost,
            number_of_generation,
          }) => {
            return (
              <div key={x_engine_id}>
                <EngineUsageCard
                  engineName={x_engine_name}
                  cost={total_cost}
                  numberOfGeneration={number_of_generation}
                  percent={getPercent(number_of_generation, totalGenerations)}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

const EngineUsageCard: React.FC<{
  engineName: string;
  cost: number;
  numberOfGeneration: number;
  percent?: number;
}> = ({ engineName, cost, numberOfGeneration, percent }) => {
  const formatPriceValue = (value) => `$ ${Number(value).toFixed(3)}`;
  const formatPercentValue = (value) => `~ ${Number(value).toFixed(0)} %`;
  const formatGenerationsValue = (value) => `${Number(value).toFixed(0)}`;

  return (
    <div className="bg-white p-3.5 rounded-md shadow">
      <p className="font-medium text-xs text-gray-500 mb-2">{engineName}</p>
      <div className="flex justify-between items-center">
        <AnimatedNumber
          className="font-medium text-xl text-black mt-1"
          value={cost}
          formatValue={formatPriceValue}
          duration={400}
        />
        <AnimatedNumber
          className="font-medium text-md text-black mt-1 text-indigo-600"
          value={numberOfGeneration}
          formatValue={formatGenerationsValue}
          duration={400}
        />
      </div>
      {percent !== undefined && (
        <AnimatedNumber
          className="mt-1 font-normal text-xs text-green-600 bg-green-100 max-w-max px-2 rounded-xl flex items-center"
          value={percent}
          formatValue={formatPercentValue}
          duration={400}
        />
      )}
    </div>
  );
};
