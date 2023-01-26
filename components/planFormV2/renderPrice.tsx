import classNames from "classnames";
import { useRouter } from "next/router";
import {
  Interval,
  SubscriptionPlan,
  SubscriptionV2,
} from "../../api/credit_v2";

interface RenderPriceProps {
  plans: SubscriptionPlan[];
  checked: boolean;
  subscription: SubscriptionV2;
  discountPercent: number;
  description: {
    [key: string]: string[];
  };
}

const RenderPrice: React.FC<RenderPriceProps> = ({
  plans,
  checked,
  subscription,
  discountPercent,
  description,
}) => {
  const router = useRouter();
  const { locale } = router;
  const { price, id, interval } = plans[0];
  return (
    <>
      <div
        className={classNames(
          checked ? "text-indigo-700" : "text-gray-500",
          "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-left"
        )}
      >
        {plans[0]?.description ? (
          <>
            {plans[0]?.description &&
              plans[0]?.description[locale]?.map((text) => (
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
        <div
          className={classNames(
            checked ? "text-indigo-900" : "text-gray-900",
            "font-medium"
          )}
        >
          $
          {subscription?.subscription_plan?.id === id
            ? (price *
                (discountPercent !== null ? 100 - discountPercent : 100)) /
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
      </div>
    </>
  );
};

export default RenderPrice;
