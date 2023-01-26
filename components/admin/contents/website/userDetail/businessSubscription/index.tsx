import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  cancelXPlanOfUser,
  Customer,
  updateXPlanOfUser,
} from "../../../../../../api/admin/user";
import {
  getBusinessPlans,
  Interval,
  Plan,
} from "../../../../../../api/credit_v2";
import { getProfile } from "../../../../../../api/user";
import { setToastify, ToastStatus } from "../../../../../../store/main/actions";
import convertTimezone from "../../../../../../utils/convertTimezone";
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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plan, selectPlan]: [plan: Plan, selectPlan: any] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isOpenChangeModal, openChangeModal] = useState<boolean>(false);
  const [isOpenCancelModal, openCancelModal] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const onSubmit = () => {
    setLoading(true);
    updateXPlanOfUser({
      id: info.id,
      stripe_subscription_id: info?.x_subscription.stripe_subscription_id,
      price_id: plan?.price_id,
      business_id: info?.business?.id,
    })
      .then((res) => {
        onChange(res);

        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Updated the user's plan",
          })
        );
      })
      .catch((err) => {
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
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
        dispatch(getProfile({ teamId: null, customerId: null }));
      });
  };

  const onCancel = () => {
    setLoading(true);
    cancelXPlanOfUser({
      id: info.id,
      stripe_subscription_id: info?.x_subscription.stripe_subscription_id,
    })
      .then((res) => {
        onChange(res);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Canceled the user's plan",
          })
        );
      })
      .catch((err) => {
        const errorCode = err.response?.status;
        const errorDetail = err.response?.data?.detail;
        if (errorCode === 406 && errorDetail === "You don't have permission") {
          router.push("/", undefined, { shallow: true });
        }
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
        dispatch(getProfile({ teamId: null, customerId: null }));
      });
  };

  useEffect(() => {
    getBusinessPlans().then((res) => {
      setPlans(res);
    });
  }, []);

  useEffect(() => {
    const plan = plans.find((plan) => {
      return plan?.price_id == info?.x_subscription.x_plan?.price_id;
    });
    if (plan) {
      selectPlan(plan);
    }
  }, [info?.x_subscription.x_plan?.price_id, plans]);

  return (
    <Block title="Business Subscription">
      <div>
        <div className="flex items-center">
          <p className="font-normal text-sm text-gray-500">Plan Name:</p>
          {info?.x_subscription?.x_plan?.name["en"] && (
            <p
              className="ml-3 font-normal text-xs max-w-max px-2 rounded-xl"
              style={{
                color: info?.x_subscription?.x_plan?.color ?? "#000",
                backgroundColor: `${info?.x_subscription?.x_plan?.color}20`,
              }}
            >
              {info?.x_subscription?.x_plan?.name["en"]}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <p className="font-normal text-sm text-gray-500">
              Next Invoice On:
            </p>
            <p className="ml-3 font-semibold text-sm text-gray-700">
              {convertTimezone(info.x_upcoming_invoice_on, router.locale, true)}{" "}
              {info?.upcoming_invoice_amount && (
                <span>for ${info.x_upcoming_invoice_amount / 100}</span>
              )}
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-normal text-sm text-gray-500">Billing Cycle:</p>
            {info?.x_subscription?.x_plan?.interval === Interval.annual && (
              <p className="ml-3 font-normal text-xs text-green-700 bg-green-200 max-w-max px-2 rounded-xl uppercase">
                {info?.x_subscription?.x_plan?.interval}
              </p>
            )}
            {info?.x_subscription?.x_plan?.interval === Interval.monthly && (
              <p className="ml-3 font-normal text-xs text-gray-700 bg-gray-200 max-w-max px-2 rounded-xl uppercase">
                {info?.x_subscription?.x_plan?.interval}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <PlanForm
          plan={plan}
          selectPlan={selectPlan}
          plans={plans}
          subscription={info?.x_subscription}
        />
      </div>
      <div className="flex w-full items-center pt-5 mt-6 border-t border-solid border-gray-0">
        {info?.x_subscription &&
        plan &&
        info?.x_subscription.x_plan?.price_id === plan?.price_id ? (
          <SmRedButton
            className="w-full sm:w-1/3 py-2.5"
            onClick={() => {
              openCancelModal(true);
            }}
            disabled={isLoading}
          >
            Cancel Plan
          </SmRedButton>
        ) : (
          <SmPinkButton
            className="w-full sm:w-1/3 py-2.5"
            onClick={() => {
              openChangeModal(true);
            }}
            disabled={isLoading}
          >
            Change Plan
          </SmPinkButton>
        )}
      </div>
      <ConfirmUpdateInfoModal
        title="Update Plan"
        message="Are you sure you want to update this user's subscription?"
        isOpenModal={isOpenChangeModal}
        openModal={openChangeModal}
        handleOkay={onSubmit}
      />
      <ConfirmUpdateInfoModal
        title="Cancel Plan"
        message="Are you sure you want to cancel this user's subscription?"
        isOpenModal={isOpenCancelModal}
        openModal={openCancelModal}
        handleOkay={onCancel}
      />
    </Block>
  );
}
