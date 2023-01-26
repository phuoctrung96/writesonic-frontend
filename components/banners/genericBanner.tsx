import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const GenericBanner: React.FC = () => {
  const router = useRouter();
  const { teamId } = router.query;
  return (
    <>
      <div className="hidden sm:block">
        <BannerContent />
      </div>
      <div
        className="flex sm:hidden justify-center items-center font-bold hover:text-red-100 w-full cursor-pointer"
        onClick={() => {
          router.push(
            "https://us06web.zoom.us/webinar/register/WN_SO98f1tPRoyeqF1eRMhKTA"
          );
        }}
      >
        <BannerContent />
      </div>
    </>
  );
};

export default GenericBanner;

const BannerContent: React.FC = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const endDate: Date = useMemo(() => {
    return new Date("2022-04-19T14:00:00+00:00".replace(/\s/, "T"));
  }, []);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minuts, setMinues] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const timeId = setInterval(() => {
      const nowDate = Date.now();
      let miliseconds = endDate.getTime() - nowDate;
      // console.log(miliseconds)
      if (miliseconds < 0) {
        clearInterval(timeId);
        return;
      }
      let seconds = miliseconds / 1000;
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);
      // console.log(d);
      // console.log(h);
      // console.log(m);
      // console.log(s);
      setDays(d);
      setHours(h);
      setMinues(m);
      setSeconds(s);
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, [endDate]);

  if (days <= 0 && hours <= 0 && minuts <= 0 && seconds <= 0) {
    return null;
  }

  return (
    <div className="px-1 py-1 w-full" style={{ backgroundColor: "#DB2625" }}>
      <div className="flex flex-wrap justify-center items-center space-x-0 sm:space-x-5 space-y-3 sm:space-y-0 text-normal text-gray-100 font-medium leading-3">
        <div className="px-2 text-base sm:text-xl">
          <p className="leading-4">
            <strong>
              Register for Writesonic&#39;s Next Live Training Session
            </strong>
          </p>
          {/* <p className="leading-4">
                        Learn how Writesonic can help you achieve your content goals.
                    </p> */}
        </div>
        <div className="grid grid-cols-4 gap-x-4">
          <DateBlock value={days.toString()} name="Days" />
          <DateBlock value={hours.toString()} name="Hours" />
          <DateBlock value={minuts.toString()} name="Minutes" />
          <DateBlock value={seconds.toString()} name="Seconds" />
        </div>
        <Link
          href="https://us06web.zoom.us/webinar/register/WN_SO98f1tPRoyeqF1eRMhKTA"
          shallow
        >
          <a
            className="px-2 pl-5 sm:flex justify-center items-center font-bold hover:text-yellow-100"
            target="_blank"
            rel="nofollow"
          >
            <button
              type="button"
              className="inline-flex items-center px-5 py-2 border border-transparent text-sm leading-4 font-medium rounded-sm shadow-sm bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 text-black"
            >
              <span>Register now</span>
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

const DateBlock: React.FC<{ value: string; name: string }> = ({
  value,
  name,
}) => {
  const strValue = value.length < 2 ? "0" + value : value;
  return (
    <div className="text-center">
      <div className="grid grid-cols-2 text-xs sm:text-sm font-bold text-black gap-1">
        {strValue.split("").map((v, index) => {
          return (
            <p key={index} className="bg-white px-2 py-0.5 rounded-sm">
              {v}
            </p>
          );
        })}
      </div>
      <p className="text-xxs sm:text-xs">{name}</p>
    </div>
  );
};
