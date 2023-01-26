import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  CreditHistoryInterface,
  getAllForThisMonth,
} from "../../../../../api/admin/creditHistory";
import getPercent from "../../../../../utils/getPercent";
import Overlay from "../../../../customer/overlay";
import PriceCard from "../../priceCard";

export default function ExpenditureMonth() {
  const mounted = useRef(false);
  const router = useRouter();
  const [data, setData] = useState<CreditHistoryInterface>({
    subscription: 0,
    lifetime: 0,
    free: 0,
  });
  const [iseLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getAllForThisMonth()
      .then((res) => {
        if (mounted.current) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted.current) {
          setIsLoading(false);
        }
        const errorCode = err.response?.status;
        const errorDetail = err.response?.data?.detail;
        if (errorCode === 406 && errorDetail === "You don't have permission") {
          router.push("/", undefined, { shallow: true });
        }
      });
  }, [router]);

  const { subscription, lifetime, free } = data;
  const total = subscription + lifetime + free;

  return (
    <div>
      <p className="font-normal text-md text-black">
        OpenAI Expenditure This Month (Till date)
      </p>
      <div className="relative">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-3">
          <PriceCard name="Total" price={total} percent={100} />
          <PriceCard
            name="Subscription"
            price={subscription}
            percent={getPercent(subscription, total)}
          />
          <PriceCard
            name="Lifetime"
            price={lifetime}
            percent={getPercent(lifetime, total)}
          />
          <PriceCard
            name="Free"
            price={free}
            percent={getPercent(free, total)}
          />
        </div>
        <Overlay isShowing={iseLoading} hideLoader />
      </div>
    </div>
  );
}
