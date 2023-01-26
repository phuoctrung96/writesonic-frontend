import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Interval,
  Plan,
  SubscriptionV2,
  validateCoupon,
} from "../../api/credit_v2";
import AnnualSwitch from "../annualSwitch";
import { ID_STRIPE } from "../customer/dashboardContent/settings/planBilling/selectPaymentMethod";
import TextInput from "../textInput";

function PlanForm({
  plans,
  plan,
  selectPlan,
  coupon,
  setCoupon,
  subscription,
  discountPercent,
  currentPayment,
}: {
  plans: Plan[];
  plan: Plan;
  selectPlan: any;
  coupon: string;
  setCoupon: any;
  subscription: SubscriptionV2;
  discountPercent: number;
  currentPayment: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isAnnual, setAnnual] = useState(false);
  const [filterPlans, setPlans] = useState([]);
  const [couponError, setCouponError] = useState(false);
  const [couponInfo, setCouponInfo] = useState("");

  useEffect(() => {
    if (!plans || !plans.length) {
      return;
    }
    setPlans(
      isAnnual
        ? plans.filter((plan) => plan.interval === Interval.annual)
        : plans.filter((plan) => plan.interval === Interval.monthly)
    );
  }, [plans, isAnnual]);

  useEffect(() => {
    if (subscription) {
      selectPlan(
        filterPlans.find(
          (plan) =>
            plan.price_id === subscription?.subscription_plan?.stripe_price_id
        )
      );
    }
  }, [filterPlans, selectPlan, subscription]);

  useEffect(() => {
    setAnnual(subscription?.subscription_plan?.interval === Interval.annual);
  }, [subscription]);

  useEffect(() => {
    setCouponError(false);
  }, [coupon]);

  useEffect(() => {
    setCouponInfo("");
  }, [coupon]);

  useEffect(() => {
    const validatePromoCode = setTimeout(() => {
      if (coupon && coupon !== "null") {
        validateCoupon(coupon)
          .then((res) => {
            if (res["metadata"]) {
              setCouponInfo(
                `✨ This coupon gets you ${
                  res["metadata"]["percent_off"]
                }% off ${
                  res["metadata"]["duration"] === "forever" ? "" : "for"
                } ${res["metadata"]["duration"]}.`
              );
            }
          })
          .catch((err) => {
            setCouponError(true);
          });
      }
    }, 500);

    return () => clearTimeout(validatePromoCode);
  }, [coupon]);

  return (
    <div>
      {!!plans.find(({ interval }) => interval === Interval.annual) && (
        <AnnualSwitch enabled={isAnnual} setEnabled={setAnnual} />
      )}
      <RadioGroup value={plan} onChange={selectPlan} className="mt-5">
        <RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
        <div className="relative bg-white rounded-md -space-y-px">
          {filterPlans?.map((plan, planIdx) => {
            const { id, name, description, price, price_id } = plan;
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
                        {name ? name[router.locale] : ""}
                      </RadioGroup.Label>
                    </div>

                    <div
                      className={classNames(
                        checked ? "text-indigo-700" : "text-gray-500",
                        "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-left"
                      )}
                    >
                      {description[router?.locale ?? 0]?.map((text) => (
                        <p key={text}>{text}</p>
                      ))}
                    </div>
                    <div className="text-right my-auto">
                      <div
                        className={classNames(
                          checked ? "text-indigo-900" : "text-gray-900",
                          "font-medium"
                        )}
                      >
                        $
                        {subscription?.subscription_plan?.stripe_price_id ===
                        price_id
                          ? (price *
                              (100 -
                                (discountPercent == 100
                                  ? 0
                                  : discountPercent))) /
                            10000
                          : price / 100}{" "}
                        / {isAnnual ? "year" : "month"}
                        {discountPercent < 100 &&
                          subscription?.subscription_plan?.stripe_price_id ===
                            price_id &&
                          discountPercent && (
                            <p className="text-green-600 font-medium text-sm">
                              ({discountPercent}% Off)
                            </p>
                          )}
                      </div>
                      {/* <p
                        className={classNames(
                          checked ? "text-indigo-700" : "text-gray-700",
                          "font-medium"
                        )}
                      >
                        {credits} credits
                      </p> */}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            );
          })}
          <div
            className={classNames(
              "grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1 mt-6",
              currentPayment === ID_STRIPE ? "visible" : "invisible"
            )}
          >
            <div className="sm:col-span-3 mt-6">
              <TextInput
                htmlFor="coupon"
                label={t("settings:promo_code_optional")}
                type="text"
                name="coupon"
                id="coupon"
                autoComplete="family-name"
                onChange={(e) => {
                  setCoupon(e.target.value);
                }}
                error={couponError ? "Please enter a valid promo code." : ""}
                info={couponInfo ? couponInfo : ""}
              />
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    plans: state.options?.plans,
    subscription: state.user?.subscription,
    discountPercent: state.user?.subscription?.discount_percent_off ?? 100,
  };
};

export default connect(mapStateToPros)(PlanForm);
