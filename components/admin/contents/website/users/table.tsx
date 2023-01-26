import classNames from "classnames";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { AdminDashboardOutputUser } from "../../../../../api/admin/user";
import { Plan } from "../../../../../api/credit_v2";
import convertTimezone from "../../../../../utils/convertTimezone";

const columns = [
  "name",
  "email",
  "is in grey list",
  "plan",
  "monthly/annual",
  "plan amount",
  "last payment on",
  "credits used (today)",
  "Recurring credits used",
];

function Table({
  plans,
  data,
  onSelect,
}: {
  plans: Plan[];
  data: AdminDashboardOutputUser[];
  onSelect?: Function;
}) {
  const router = useRouter();
  if (!data || !data.length) {
    return null;
  }
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns?.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider whitespace-nowrap"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.map(
                  ({
                    id,
                    full_name,
                    email,
                    plan_name,
                    plan_interval,
                    plan_price,
                    is_subscription_canceled,
                    recurring_credit_usage_last_3_renewal_months,
                    recurring_credit_usage_last_7_days,
                    lifetime_credit_usage_last_7_days,
                    one_time_credit_usage_last_7_days,
                    reward_credit_usage_last_7_days,
                    last_payment_on,
                    grey_id,
                  }) => {
                    const today = new Date();
                    const year = today.getUTCFullYear();
                    const month =
                      today.getUTCMonth() + 1 < 10
                        ? "0" + (today.getUTCMonth() + 1)
                        : today.getUTCMonth() + 1;
                    const day =
                      today.getUTCDate() < 10
                        ? "0" + today.getUTCDate()
                        : today.getUTCDate();
                    const todayKey = `${month}/${day}/${year}`;
                    const thisMonthKey = `${month}/${year}`;
                    // parse json
                    const recurringCreditUsageLast7days = JSON.parse(
                      recurring_credit_usage_last_7_days
                    );
                    const lifeTimeCreditUsageLast7days = JSON.parse(
                      lifetime_credit_usage_last_7_days
                    );
                    const oneTimeCreditUsageLast7days = JSON.parse(
                      one_time_credit_usage_last_7_days
                    );
                    const rewardCreditUsageLast7days = JSON.parse(
                      reward_credit_usage_last_7_days
                    );
                    const creditsUsedToday = recurringCreditUsageLast7days
                      ? recurringCreditUsageLast7days[todayKey] ?? 0
                      : 0 + lifeTimeCreditUsageLast7days
                      ? lifeTimeCreditUsageLast7days[todayKey] ?? 0
                      : 0 + oneTimeCreditUsageLast7days
                      ? oneTimeCreditUsageLast7days[todayKey] ?? 0
                      : 0 + rewardCreditUsageLast7days
                      ? rewardCreditUsageLast7days[todayKey] ?? 0
                      : 0;

                    const recurringCreditUsageLast3RenewalMonths = JSON.parse(
                      recurring_credit_usage_last_3_renewal_months
                    );
                    return (
                      <tr
                        key={id}
                        className={`${
                          onSelect ? "hover:bg-indigo-50 cursor-pointer" : ""
                        } transition-colors`}
                        onClick={() => {
                          if (onSelect) onSelect(id);
                        }}
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 select-none">
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            {full_name}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 select-none">
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            {email}
                          </p>
                        </td>
                        <td
                          className={classNames(
                            "px-6 py-4 text-sm select-none",
                            !!grey_id ? "text-red-500 " : "text-gray-500 "
                          )}
                        >
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            {!!grey_id ? "Yes" : "No"}
                          </p>
                        </td>
                        <td className="px-6 py-4 select-none">
                          {!is_subscription_canceled &&
                            !!plan_name &&
                            !!plan_name["en"] && (
                              <p
                                className="whitespace-nowrap font-medium px-2 py-1 rounded-2xl text-xs capitalize w-max"
                                style={{
                                  color: "#000",
                                  backgroundColor: "#00000020",
                                }}
                              >
                                {plan_name["en"] ?? ""}
                              </p>
                            )}
                        </td>
                        <td className="px-6 py-4 select-none">
                          {!is_subscription_canceled &&
                            plan_interval?.toLowerCase().includes("annual") && (
                              <p className="whitespace-nowrap font-medium px-2 py-1 text-green-500 bg-green-100 rounded-2xl text-xs capitalize w-max">
                                {plan_interval ?? ""}
                              </p>
                            )}
                          {!is_subscription_canceled &&
                            plan_interval
                              ?.toLowerCase()
                              .includes("monthly") && (
                              <p className="whitespace-nowrap font-medium px-2 py-1 text-gray-500 bg-gray-100 rounded-2xl text-xs capitalize w-max">
                                {plan_interval ?? ""}
                              </p>
                            )}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500 select-none">
                          {!is_subscription_canceled && plan_price && (
                            <p className="whitespace-nowrap font-medium px-2 py-1">
                              $ {plan_price / 100 ?? ""}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 select-none">
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            {convertTimezone(last_payment_on, router.locale)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 select-none">
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            {creditsUsedToday}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 select-none">
                          <div className="whitespace-nowrap font-medium px-2 py-1">
                            {recurringCreditUsageLast3RenewalMonths &&
                              Object.keys(
                                recurringCreditUsageLast3RenewalMonths
                              ).map((key) => {
                                return (
                                  <div key={key}>
                                    <p className="text-xs">
                                      {key}:{" "}
                                      <span className="font-bold ml-3">
                                        {
                                          recurringCreditUsageLast3RenewalMonths[
                                            key
                                          ]
                                        }
                                      </span>
                                    </p>
                                  </div>
                                );
                              })}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    plans: state.options?.plans ?? [],
  };
};

export default connect(mapStateToPros)(Table);
