import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { CountBusinessUser, countUsers } from "../../../../../api/admin/user";
import getPercent from "../../../../../utils/getPercent";
import Overlay from "../../../../customer/overlay";
import CountCard from "../../countCard";

export default function CountUsers() {
  const mounted = useRef(false);
  const router = useRouter();
  const [data, setData] = useState<CountBusinessUser>({
    all: 0,
    active: 0,
    inactive: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    countUsers()
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

  const { all, active, inactive } = data;

  return (
    <div>
      <p className="font-normal text-md text-black">Business Users</p>
      <div className="relative">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4 mt-3">
          <CountCard name="All" value={all} />
          <CountCard
            name="Active"
            value={active}
            percent={getPercent(active, all)}
          />
          <CountCard
            name="Inactive"
            value={inactive}
            percent={getPercent(inactive, all)}
          />
        </div>
        <Overlay isShowing={isLoading} hideLoader />
      </div>
    </div>
  );
}
