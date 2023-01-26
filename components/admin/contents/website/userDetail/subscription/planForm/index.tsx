import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getAllPlans } from "../../../../../../../api/admin/credit";
import {
  Interval,
  SubscriptionPlan,
  SubscriptionProduct,
  SubscriptionV2,
} from "../../../../../../../api/credit_v2";
import AnnualSwitch from "../../../../../../annualSwitch";
import RenderPrice from "./renderPrice";
import RenderPrices from "./renderPrices";

interface PlanFormProps {
  plan: SubscriptionPlan;
  setPlan: Dispatch<SetStateAction<SubscriptionPlan>>;
  product: SubscriptionProduct;
  setProduct: Dispatch<SetStateAction<SubscriptionProduct>>;
  subscription: SubscriptionV2;
  discountPercent: number;
}

const PlanForm: React.FC<PlanFormProps> = ({
  plan,
  setPlan,
  product,
  setProduct,
  subscription,
  discountPercent,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;
  const [isAnnual, setAnnual] = useState(false);
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

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
                          "ml-3 font-medium"
                        )}
                      >
                        {name ? name[locale] : ""}
                      </RadioGroup.Label>
                    </div>

                    <div
                      className={classNames(
                        checked ? "text-indigo-700" : "text-gray-500",
                        "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-left"
                      )}
                    >
                      {description &&
                        description[locale]?.map((text) => (
                          <p key={text}>{text}</p>
                        ))}
                    </div>
                    <div className="text-right my-auto flex-1">
                      {plans?.length > 1 ? (
                        <RenderPrices
                          plan={plan}
                          setPlan={setPlan}
                          plans={plans}
                          checked={checked}
                          subscription={subscription}
                          discountPercent={discountPercent}
                        />
                      ) : (
                        <RenderPrice
                          plans={plans}
                          checked={checked}
                          subscription={subscription}
                          discountPercent={discountPercent}
                        />
                      )}
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
};

export default PlanForm;
