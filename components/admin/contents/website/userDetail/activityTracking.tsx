import { useRouter } from "next/router";
import { Customer } from "../../../../../api/admin/user";
import convertTimezone from "../../../../../utils/convertTimezone";
import Block from "../../../../block";

function TrackingCard({ name, date }: { name: string; date: string }) {
  return (
    <div className="p-5 rounded-md bg-gray-100">
      <p className="font-medium text-sm text-gray-600 uppercase">{name}</p>
      <p className="font-bold text-sm text-black mt-5">{date}</p>
    </div>
  );
}

export default function ActivityTracking({ info }: { info: Customer }) {
  const router = useRouter();

  const today = new Date();
  const thisMonth = `${today.getUTCMonth() + 1} / ${today.getUTCFullYear()}`;

  return (
    <Block title="Activity Tracking">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        <TrackingCard
          name="registered on"
          date={convertTimezone(info?.created_date, router.locale)}
        />
        <TrackingCard
          name="last signed in on"
          date={convertTimezone(info?.last_signed_date, router.locale)}
        />
        <TrackingCard
          name="last used on"
          date={convertTimezone(info?.last_used_date, router.locale)}
        />
      </div>
      <div className="mt-8 p-5 rounded-md bg-gray-100">
        <div className="flex justify-between">
          <p className="font-medium text-sm text-gray-600 uppercase">
            CURRENT CREDITS USAGE
          </p>
        </div>
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <p className="text-sm font-normal capitalize">
                Recurring credits
              </p>
              <p className="text-xs font-bold">
                {info?.recurring_credits_used_this_month?.period ?? ""}
              </p>
            </div>
            <p className="text-3xl text-indigo-700 font-bold text-right">
              {info?.recurring_credits_used_this_month?.credits}
            </p>
            <div>
              <p className="text-sm font-normal capitalize">
                Unknown Recurring credits
              </p>
              <p className="text-xs font-bold">{thisMonth}</p>
            </div>
            <p className="text-3xl text-indigo-700 font-bold text-right">
              {info?.unknown_recurring_credits_used_this_month}
            </p>
            <div>
              <p className="text-sm font-normal capitalize">Lifetime credits</p>
              <p className="text-xs font-bold">{thisMonth}</p>
            </div>
            <p className="text-3xl text-indigo-700 font-bold text-right">
              {info?.lifetime_credits_used_this_month}
            </p>
            <div>
              <p className="text-sm font-normal capitalize">One-time credits</p>
              <p className="text-xs font-bold">{thisMonth}</p>
            </div>
            <p className="text-3xl text-indigo-700 font-bold text-right">
              {info?.one_time_credits_used_this_month}
            </p>
            <div>
              <p className="text-sm font-normal capitalize">Reward credits</p>
              <p className="text-xs font-bold">{thisMonth}</p>
            </div>
            <p className="text-3xl text-indigo-700 font-bold text-right">
              {info?.reward_credits_used_this_month}
            </p>
          </div>
        </div>
      </div>
    </Block>
  );
}
