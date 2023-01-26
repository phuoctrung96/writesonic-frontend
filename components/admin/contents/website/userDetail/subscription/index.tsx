import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  cancelPaypalPlanOfUser,
  cancelPlanOfUser,
  Customer,
  reactiveSubscription,
  updatePaypalPlanOfUser,
  updatePlanOfUser,
} from "../../../../../../api/admin/user";
import {
  Interval,
  SubscriptionPlan,
  SubscriptionProduct,
} from "../../../../../../api/credit_v2";
import { setToastify, ToastStatus } from "../../../../../../store/main/actions";
import convertTimezone from "../../../../../../utils/convertTimezone";
import getErrorMessage from "../../../../../../utils/getErrorMessage";
import Block from "../../../../../block";
import SmPinkButton from "../../../../../buttons/smPinkButton";
import SmRedButton from "../../../../../buttons/smRedButton";
import ConfirmUpdateInfoModal from "../../../conformUpdateInfoModal";
import PlanForm from "./planForm";

export default function SubscriptionBlock({
  info,
  onChange,
}: {
  info: Customer;
  onChange: Function;
}) {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale } = router;

  const [product, setProduct] = useState<SubscriptionProduct>(null);
  const [plan, setPlan] = useState<SubscriptionPlan>(null);
  const [isLoading, setLoading] = useState(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState<boolean>(false);
  const [isOpenCancelModal, setIsOpenCancelModal] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const onUpdatePlan = async () => {
    try {
      setLoading(true);
      const { stripe_subscription_id, paypal_subscription_id } =
        info.subscription;
      let res = null;
      if (stripe_subscription_id) {
        res = await updatePlanOfUser({
          id: info.id,
          stripe_subscription_id,
          price_id: plan?.stripe_price_id,
        });
      } else if (paypal_subscription_id) {
        res = await updatePaypalPlanOfUser({
          id: info.id,
          paypal_subscription_id,
          paypal_plan_id: plan?.paypal_plan_id,
        });
      } else {
        new Error(null);
      }
      onChange(res);

      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Updated the user's plan",
        })
      );
    } catch (err) {
      const errorCode = err.response?.status;
      const errorDetail = err.response?.data?.detail;
      if (errorCode === 406 && errorDetail === "You don't have permission") {
        router.push("/", undefined, { shallow: true });
      } else {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: err.response?.data?.detail ?? "Failed to update a plan.",
          })
        );
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const onCancel = async () => {
    try {
      setLoading(true);
      const { stripe_subscription_id, paypal_subscription_id } =
        info.subscription;
      let res = null;
      if (stripe_subscription_id) {
        res = await cancelPlanOfUser({
          id: info.id,
          stripe_subscription_id,
        });
      } else if (paypal_subscription_id) {
        res = await cancelPaypalPlanOfUser({
          id: info.id,
          paypal_subscription_id,
        });
      } else {
        new Error(null);
      }

      onChange(res);
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Canceled the user's plan",
        })
      );
    } catch (err) {
      const errorCode = err.response?.status;
      const errorDetail = err.response?.data?.detail;
      if (errorCode === 406 && errorDetail === "You don't have permission") {
        router.push("/", undefined, { shallow: true });
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const handleReactiveSubscription = async () => {
    try {
      setLoading(true);
      const { stripe_subscription_id } = info.subscription;
      const res = await reactiveSubscription({
        id: info.id,
        stripe_subscription_id,
      });
      onChange(res);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Block title="Subscription">
      <div>
        <div className="flex items-center">
          <p className="font-normal text-sm text-gray-500">Plan Name:</p>
          {info?.subscription?.subscription_product?.name["en"] && (
            <p
              className="ml-3 font-normal text-xs max-w-max px-2 rounded-xl"
              style={{
                color:
                  info?.subscription?.subscription_product?.color ?? "#000",
                backgroundColor: `${info?.subscription?.subscription_product?.color}20`,
              }}
            >
              {info?.subscription?.subscription_product?.name["en"]}
            </p>
          )}
        </div>

        <div className="grid grid-cols gap-y-1">
          <div className="flex items-center">
            <p className="font-normal text-sm text-gray-500">
              Next Invoice On:
            </p>
            <p className="ml-3 font-semibold text-sm text-gray-700">
              {convertTimezone(info.upcoming_invoice_on, router.locale, true)}{" "}
              {info?.upcoming_invoice_amount && (
                <span>for ${info.upcoming_invoice_amount / 100}</span>
              )}
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-normal text-sm text-gray-500">Billing Cycle:</p>
            {info?.subscription?.subscription_plan?.interval ===
              Interval.annual && (
              <p className="ml-3 font-normal text-xs text-green-700 bg-green-200 max-w-max px-2 rounded-xl uppercase">
                {info?.subscription?.subscription_plan?.interval}
              </p>
            )}
            {info?.subscription?.subscription_plan?.interval ===
              Interval.monthly && (
              <p className="ml-3 font-normal text-xs text-gray-700 bg-gray-200 max-w-max px-2 rounded-xl uppercase">
                {info?.subscription?.subscription_plan?.interval}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <p className="font-normal text-sm text-gray-500">Payment method:</p>
            <p className="ml-3 font-semibold text-sm text-gray-700">
              {info?.subscription?.stripe_subscription_id ? "Stripe" : "Paypal"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <PlanForm
          plan={plan}
          setPlan={setPlan}
          product={product}
          setProduct={setProduct}
          subscription={info?.subscription}
          discountPercent={info?.subscription?.discount_percent_off}
        />
      </div>
      {info?.subscription?.stripe_subscription_id && (
        <div className="flex w-full items-center pt-5 mt-6 border-t border-solid border-gray-0">
          {info.subscription &&
          plan &&
          info.subscription.subscription_plan?.stripe_price_id ===
            plan?.stripe_price_id ? (
            <>
              {info.subscription.cancel_at_period_end ? (
                <div className="w-full">
                  <p className="text-normal text-sm text-gray-500 py-2">
                    The plan is scheduled to be cancelled on{" "}
                    {convertTimezone(info.subscription?.cancel_date, locale)}
                  </p>
                  <SmRedButton
                    className="w-full sm:w-1/3 py-2.5"
                    onClick={handleReactiveSubscription}
                    disabled={isLoading}
                  >
                    Reactivate Subscription
                  </SmRedButton>
                </div>
              ) : (
                <SmRedButton
                  className="w-full sm:w-1/3 py-2.5"
                  onClick={() => {
                    setIsOpenCancelModal(true);
                  }}
                  disabled={isLoading}
                >
                  Cancel Plan
                </SmRedButton>
              )}
            </>
          ) : (
            <SmPinkButton
              className="w-full sm:w-1/3 py-2.5"
              onClick={() => {
                setIsOpenChangeModal(true);
              }}
              disabled={isLoading}
            >
              Change Plan
            </SmPinkButton>
          )}
        </div>
      )}
      <ConfirmUpdateInfoModal
        title="Update Plan"
        message="Are you sure you want to update this user's subscription?"
        isOpenModal={isOpenChangeModal}
        openModal={setIsOpenChangeModal}
        handleOkay={onUpdatePlan}
      />
      <ConfirmUpdateInfoModal
        title="Cancel Plan"
        message="Are you sure you want to cancel this user's subscription?"
        isOpenModal={isOpenCancelModal}
        openModal={setIsOpenCancelModal}
        handleOkay={onCancel}
      />
    </Block>
  );
}
