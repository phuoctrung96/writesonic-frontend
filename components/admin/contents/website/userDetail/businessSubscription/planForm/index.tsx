import { RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";
import {
  Interval,
  Plan,
  XSubscription,
} from "../../../../../../../api/credit_v2";
import AnnualSwitch from "../../../../../../annualSwitch";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PlanForm({
  plans,
  plan,
  selectPlan,
  subscription,
}: {
  plans: Plan[];
  plan: Plan;
  selectPlan: any;
  subscription: XSubscription;
}) {
  const [isAnnual, setAnnual] = useState(
    subscription?.x_plan?.interval === Interval.annual
  );
  const [filterPlans, setPlans] = useState([]);

  useEffect(() => {
    setPlans(
      isAnnual
        ? plans.filter((plan) => plan?.interval === Interval.annual)
        : plans.filter((plan) => plan?.interval === Interval.monthly)
    );
  }, [isAnnual, plans]);

  useEffect(() => {
    if (subscription) {
      selectPlan(
        filterPlans.find(
          (plan) => plan?.price_id === subscription?.x_plan?.price_id
        )
      );
    }
  }, [filterPlans, selectPlan, subscription]);

  return (
    <div>
      {!!plans.find(({ interval }) => interval === Interval.annual) && (
        <AnnualSwitch enabled={isAnnual} setEnabled={setAnnual} />
      )}
      <RadioGroup value={plan} onChange={selectPlan} className="mt-5">
        <RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
        <div className="relative bg-white rounded-md -space-y-px">
          {filterPlans?.map((plan, planIdx) => {
            const { id, name, description, price, credits, price_id } = plan;
            return (
              <RadioGroup.Option
                key={id}
                value={plan}
                className={({ checked }) =>
                  classNames(
                    planIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                    planIdx === plans.length - 1
                      ? "rounded-bl-md rounded-br-md"
                      : "",
                    checked
                      ? "bg-indigo-50 border-indigo-200"
                      : "border-gray-200 hover:opacity-80",
                    "relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none"
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex items-center text-sm">
                      <div>
                        <span
                          className={classNames(
                            checked
                              ? "bg-indigo-600 border-transparent"
                              : "bg-white border-gray-300",
                            active
                              ? "ring-2 ring-offset-2 ring-indigo-500"
                              : "",
                            "h-4 w-4 rounded-full border flex items-center justify-center"
                          )}
                          aria-hidden="true"
                        >
                          <span className="rounded-full bg-white w-1.5 h-1.5" />
                        </span>
                      </div>
                      <RadioGroup.Label
                        as="span"
                        className={classNames(
                          checked ? "text-indigo-900" : "text-gray-900",
                          "ml-3 font-medium"
                        )}
                      >
                        {name["en"]}
                      </RadioGroup.Label>
                    </div>

                    <div
                      className={classNames(
                        checked ? "text-indigo-700" : "text-gray-500",
                        "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-left"
                      )}
                    >
                      {description["en"]?.map((text) => (
                        <p key={text}>{text}</p>
                      ))}
                    </div>
                    <div className="text-right my-auto">
                      <p
                        className={classNames(
                          checked ? "text-indigo-900" : "text-gray-900",
                          "font-medium"
                        )}
                      >
                        $
                        {subscription?.x_plan?.price_id === price_id
                          ? (price * subscription?.discount_percent_off ??
                              100) / 10000
                          : price / 100}{" "}
                        / {isAnnual ? "year" : "month"}
                      </p>
                      <p
                        className={classNames(
                          checked ? "text-indigo-700" : "text-gray-700",
                          "font-medium"
                        )}
                      >
                        {credits} credits
                      </p>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}
