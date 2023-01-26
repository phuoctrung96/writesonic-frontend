import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  getAllPlans,
  Interval,
  SubscriptionPlan,
  SubscriptionProduct,
  SubscriptionV2,
  validateCoupon,
} from "../../api/credit_v2";
import AnnualSwitch from "../annualSwitch";
import { ID_STRIPE } from "../customer/dashboardContent/settings/planBilling/selectPaymentMethod";
import TextInput from "../textInput";
import RenderPrice from "./renderPrice";
import RenderPrices from "./renderPrices";

interface PlanFormV2Props {
  plan: SubscriptionPlan;
  setPlan: Dispatch<SetStateAction<SubscriptionPlan>>;
  product: SubscriptionProduct;
  setProduct: Dispatch<SetStateAction<SubscriptionProduct>>;
  coupon: string;
  setCoupon: any;
  subscription: SubscriptionV2;
  discountPercent: number;
  currentPayment: string;
}

const PlanFormV2: React.FC<PlanFormV2Props> = ({
  plan,
  setPlan,
  product,
  setProduct,
  coupon,
  setCoupon,
  subscription,
  discountPercent,
  currentPayment,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;
  const [isAnnual, setAnnual] = useState(false);
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [couponError, setCouponError] = useState(false);
  const [couponInfo, setCouponInfo] = useState("");
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setAnnual(subscription?.subscription_plan?.interval === Interval.annual);
  }, [subscription?.subscription_plan?.interval]);

  useEffect(() => {
    async function initialize() {
      try {
        const items = await getAllPlans({
          interval: isAnnual ? Interval.annual : Interval.monthly,
        });
        if (mounted.current) {
          setProducts(items);
        }
      } catch (err) {}
    }
    initialize();
  }, [isAnnual]);

  // select product
  const onSelectProduct = (product) => {
    setProduct(product);
    const { plans } = product;
    if (!plans?.length) {
      return;
    } else if (plans.length == 1) {
      setPlan(plans[0]);
    } else {
    }
  };

  // select active subscription when component is mounted
  useEffect(() => {
    if (!subscription) {
      return;
    }
    setProduct(
      products.find(({ plans }) =>
        plans.find((plan) => {
          if (plan?.id === subscription.subscription_plan?.id) {
            setPlan(plan);
            return true;
          }
        })
      )
    );
  }, [products, setPlan, setProduct, subscription]);

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
            if (res["metadata"] && mounted.current) {
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
      <AnnualSwitch enabled={isAnnual} setEnabled={setAnnual} />
      <RadioGroup value={product} onChange={onSelectProduct} className="mt-5">
        <RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
        <div className="relative bg-white rounded-md -space-y-px">
          {products?.map((prod, prodIndex) => {
            const { id, name, description, plans } = prod;
            if (
              subscription &&
              !subscription.stripe_subscription_id &&
              subscription.paypal_subscription_id &&
              !plans.some(({ paypal_plan_id }) => paypal_plan_id !== null)
            ) {
              return null;
            }
            return (
              <RadioGroup.Option
                key={id}
                value={prod}
                className={({ checked }) =>
                  classNames(
                    prodIndex === 0 ? "rounded-tl-md rounded-tr-md" : "",
                    prodIndex === products.length - 1
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
                          "ml-3 font-medium",
                          plans?.length > 1 && "text-lg"
                        )}
                      >
                        {name ? name[locale] : ""}
                      </RadioGroup.Label>
                    </div>

                    {plans?.length > 1 ? (
                      <RenderPrices
                        plan={plan}
                        setPlan={setPlan}
                        plans={plans}
                        checked={checked}
                        subscription={subscription}
                        discountPercent={discountPercent}
                        description={description}
                      />
                    ) : (
                      <RenderPrice
                        plans={plans}
                        checked={checked}
                        subscription={subscription}
                        discountPercent={discountPercent}
                        description={description}
                      />
                    )}
                  </>
                )}
              </RadioGroup.Option>
            );
          })}
          <p className="text-xs text-gray-500 text-right">
            <a
              className="text-grey-600 hover:text-indigo-500 cursor-pointer"
              href="https://writesonic.com/terms#fair-usage-policy"
              target="_blank"
              rel="noreferrer"
            >
              * FUP
            </a>
            <a
              className="text-grey-600 hover:text-indigo-500 cursor-pointer ml-2"
              href="https://writesonic.com/terms#basic-features"
              target="_blank"
              rel="noreferrer"
            >
              ** Basic Features
            </a>
          </p>
          {!!subscription?.stripe_subscription_id ||
            (!subscription && currentPayment === ID_STRIPE && (
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1 mt-6">
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
                    error={
                      couponError ? "Please enter a valid promo code." : ""
                    }
                    info={couponInfo ? couponInfo : ""}
                  />
                </div>
              </div>
            ))}
        </div>
      </RadioGroup>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    subscription: state.user?.subscription,
    discountPercent: state.user?.subscription?.discount_percent_off,
  };
};

export default connect(mapStateToPros)(PlanFormV2);
