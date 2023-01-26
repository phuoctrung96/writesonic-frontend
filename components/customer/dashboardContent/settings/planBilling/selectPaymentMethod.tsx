import classNames from "classnames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubscriptionPlan } from "../../../../../api/credit_v2";

export const ID_STRIPE = "stripe_";
export const ID_PAYPAL = "paypal_";

const options = [
  { id: ID_STRIPE, title: "Debit/Credit Card" },
  { id: ID_PAYPAL, title: "PayPal" },
];

const SelectPaymentMethod: React.FC<{
  currentId: string;
  setCurrentId: Dispatch<SetStateAction<string>>;
  plan: SubscriptionPlan;
}> = ({ currentId, setCurrentId, plan }) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  useEffect(() => {
    setIsDisabled(!plan?.stripe_price_id || !plan?.paypal_plan_id);
  }, [plan?.paypal_plan_id, plan?.stripe_price_id]);
  return (
    <div className={classNames(isDisabled ? "opacity-50" : "")}>
      <label className="text-base font-medium text-gray-900">
        Payment Method
      </label>
      <fieldset className="mt-4">
        <legend className="sr-only">Notification method</legend>
        <div className="grid grid-cols-2 sm:block sm:space-y-4">
          {options.map(({ id, title }) => (
            <div key={id} className="flex items-center">
              <input
                id={id}
                name="notification-method"
                type="radio"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                checked={id === currentId}
                onChange={(e) => {
                  setCurrentId(id);
                }}
                disabled={isDisabled}
              />
              <label
                htmlFor={id}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default SelectPaymentMethod;
