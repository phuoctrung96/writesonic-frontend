import classNames from "classnames";
import {
  Interval,
  SubscriptionPlan,
  SubscriptionV2,
} from "../../../../../../../api/credit_v2";

interface RenderPriceProps {
  plans: SubscriptionPlan[];
  checked: boolean;
  subscription: SubscriptionV2;
  discountPercent: number;
}

const RenderPrice: React.FC<RenderPriceProps> = ({
  plans,
  checked,
  subscription,
  discountPercent,
}) => {
  const { price, id, interval } = plans[0];
  return (
    <div
      className={classNames(
        checked ? "text-indigo-900" : "text-gray-900",
        "font-medium"
      )}
    >
      $
      {subscription?.subscription_plan?.id === id
        ? (price * (discountPercent !== null ? 100 - discountPercent : 100)) /
          10000
        : price / 100}{" "}
      / {interval == Interval.annual ? "year" : "month"}
      {discountPercent !== null &&
        subscription?.subscription_plan?.id === id &&
        discountPercent && (
          <p className="text-green-600 font-medium text-sm">
            ({discountPercent}% Off)
          </p>
        )}
    </div>
  );
};

export default RenderPrice;
