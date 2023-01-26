import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { Fragment, useState } from "react";
import { SubscriptionPlan } from "../../../../../api/credit_v2";

const RenderPrices: React.FC<{ plans: SubscriptionPlan[] }> = ({ plans }) => {
  const [activePriceId, setActivePriceId] = useState<string>(null);

  const selectPrice = (id) => {
    setActivePriceId(id);
  };
  if (!plans?.length) {
    return null;
  } else if (plans.length === 1) {
    return <span>$ {plans[0].price / 100} / month</span>;
  }
  const activePrice = plans?.find(({ id }) => id === activePriceId);
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          {activePrice ? (
            <p>${activePrice.price / 100} / month</p>
          ) : (
            <p>Please Select</p>
          )}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="z-20 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {plans.map(({ id, price, credits }) => (
              <Menu.Item key={id} onClick={() => selectPrice(id)}>
                <div
                  className={classNames(
                    activePriceId === id
                      ? "bg-indigo-100 text-gray-900"
                      : "text-gray-700",
                    "grid grid-cols-2 place-items-center px-4 py-2 text-sm cursor-pointer"
                  )}
                >
                  <p className="font-bold w-full">{credits} credits</p>
                  <p className="text-xs">${price / 100} / month</p>
                </div>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default RenderPrices;
