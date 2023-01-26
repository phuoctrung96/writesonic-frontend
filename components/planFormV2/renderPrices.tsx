import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import {
  Interval,
  SubscriptionPlan,
  SubscriptionV2,
} from "../../api/credit_v2";

interface RenderPricesProps {
  plans: SubscriptionPlan[];
  checked: boolean;
  description: {
    [key: string]: string[];
  };
  subscription: SubscriptionV2;
  discountPercent: number;
  plan: SubscriptionPlan;
  setPlan: Dispatch<SetStateAction<SubscriptionPlan>>;
}

const RenderPrices: React.FC<RenderPricesProps> = ({
  plans,
  checked,
  description,
  subscription,
  discountPercent,
  plan,
  setPlan,
}) => {
  const router = useRouter();
  const { locale } = router;
  const [activePlan, setActivePlan] = useState<SubscriptionPlan>(null);

  // select active subscription when component is mounted
  useEffect(() => {
    if (!subscription) {
      return;
    }
    const newPlan =
      plans?.find(({ id }) => id === subscription?.subscription_plan?.id) ??
      null;
    setActivePlan(newPlan);
    setPlan(newPlan);
  }, [plans, setPlan, subscription, subscription?.subscription_plan?.id]);

  useEffect(() => {
    if (checked) {
      setPlan(activePlan);
    }
  }, [activePlan, checked, setPlan]);

  const selectPrice = (newId) => {
    const newPlan = plans?.find(({ id }) => id === newId) ?? null;
    setActivePlan(newPlan);
    setPlan(newPlan);
  };
  return (
    <>
      <div
        className={classNames(
          checked ? "text-indigo-700" : "text-gray-500",
          "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-left"
        )}
      >
        {activePlan?.description ? (
          <>
            {activePlan?.description &&
              activePlan?.description[locale]?.map((text) => (
                <p key={text}>{text}</p>
              ))}
          </>
        ) : (
          <>
            {description &&
              description[locale]?.map((text) => <p key={text}>{text}</p>)}
          </>
        )}
      </div>

      <div className="text-right my-auto flex-1">
        {!checked && plans.length > 1 ? (
          <div className="text-gray-900 font-medium">
            {activePlan ? (
              <PriceDetail
                plan={activePlan}
                discountPercent={discountPercent}
                subscription={subscription}
              />
            ) : (
              <div className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700">
                <p>Please Select</p>
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        ) : (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                {activePlan ? (
                  <PriceDetail
                    plan={activePlan}
                    discountPercent={discountPercent}
                    subscription={subscription}
                  />
                ) : (
                  <p>Please Select</p>
                )}
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1 w-full">
                  {plans.map((planItem) => {
                    const { id, price, credits } = planItem;
                    return (
                      <Menu.Item key={id} onClick={() => selectPrice(id)}>
                        <div
                          className={classNames(
                            plan?.id === id
                              ? "bg-indigo-100 text-gray-900"
                              : "text-gray-700",
                            "grid grid-cols-2 place-items-center px-4 py-2 text-sm cursor-pointer"
                          )}
                        >
                          <p className="font-bold w-full whitespace-nowrap">
                            {credits} credits
                          </p>
                          <PriceDetail
                            plan={planItem}
                            discountPercent={discountPercent}
                            subscription={subscription}
                          />
                        </div>
                      </Menu.Item>
                    );
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </>
  );
};

const PriceDetail: React.FC<{
  plan: SubscriptionPlan;
  discountPercent: number;
  subscription: SubscriptionV2;
}> = ({ plan, discountPercent, subscription }) => {
  const { id, price, interval } = plan;
  return (
    <div className="text-right w-full">
      <p className="whitespace-nowrap">
        <span>
          $
          {subscription?.subscription_plan?.id === id
            ? (price *
                (discountPercent !== null ? 100 - discountPercent : 100)) /
              10000
            : plan.price / 100}
        </span>{" "}
        / <span>{interval === Interval.annual ? "year" : "month"}</span>
      </p>
      {discountPercent !== null &&
        subscription?.subscription_plan?.id === id &&
        discountPercent && (
          <p className="whitespace-nowrap text-green-600 font-medium text-sm col-span-2 pl-2">
            ({discountPercent}% Off)
          </p>
        )}
    </div>
  );
};

export default RenderPrices;
