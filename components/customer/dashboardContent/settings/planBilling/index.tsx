import { ArrowSmRightIcon, LockClosedIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  approvedPaypalSubscription,
  LifeTimeCredit,
  paymentIntentStatus,
  Plan,
  SubscriptionV2,
  updatePaypalSubscriptionRevise,
} from "../../../../../api/credit_v2";
import { TeamMemberRole } from "../../../../../api/team";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { getLifeTimePlan } from "../../../../../store/user/actions";
import LifeTimePlan from "./lifeTimePlan";
import OneTimeCreditSlider from "./oneTimeCreditSlider";
import PaymentMethod from "./paymentMethod";
import PreviousInvoices from "./previousInvoices";
import YourPlan from "./yourPlan";

function PlanBilling({
  subscription,
  lifeTimePlan,
  roleInTeam,
  plans,
  stripe_customer_id,
  businessId,
}: {
  subscription: SubscriptionV2;
  lifeTimePlan: LifeTimeCredit[];
  roleInTeam: TeamMemberRole;
  plans: Plan[];
  stripe_customer_id: string;
  businessId: string;
}) {
  const router = useRouter();
  const [paymentProcess, setPaymentProcess] = useState(false);
  const { category, price_id, success, payment_intent, teamId } = router.query;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    var is_redirect_from_paypal = router.query.paypalredirect;
    var is_redirect_from_paypal_while_revise =
      router.query.paypalsubscriptionrevise;
    if (is_redirect_from_paypal) {
      setPaymentProcess(true);
      // console.log(router.query.subscription_id);
      var subscriptionID = String(router.query.subscription_id);
      if (subscriptionID) {
        // setIsSubscribing(true);

        approvedPaypalSubscription({ teamId, subscriptionID })
          .then((data) => {})
          .catch((err) => {})
          .finally(() => {
            if (mounted.current) {
              setPaymentProcess(false);
              window.location.href = location.origin + "/settings/billing";
            }
          });
      }
    }

    if (is_redirect_from_paypal_while_revise) {
      var subscriptionID = String(router.query.subscription_id);
      setPaymentProcess(true);
      updatePaypalSubscriptionRevise({ subscriptionID })
        .then((data) => {})
        .catch((err) => {})
        .finally(() => {
          if (mounted.current) {
            setPaymentProcess(false);
            window.location.href = location.origin + "/settings/billing";
          }
        });
    }
  }, [
    router.query.paypalredirect,
    router.query.paypalsubscriptionrevise,
    router.query.subscription_id,
    teamId,
  ]);

  useEffect(() => {
    const { teamId } = router.query;
    dispatch(getLifeTimePlan(teamId));
  }, [dispatch, router.query]);

  useEffect(() => {
    if (
      price_id &&
      subscription &&
      subscription.subscription_plan &&
      price_id === subscription.subscription_plan.stripe_price_id &&
      success
    ) {
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Payment successful.",
        })
      );

      router.replace(
        teamId ? `/${teamId}/settings/${category}` : `/settings/${category}`
      );
    } else if (price_id && success) {
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "You purchased credits successfully",
        })
      );

      router.replace(
        teamId ? `/${teamId}/settings/${category}` : `/settings/${category}`
      );
    }
    if (payment_intent) {
      const status = async () => {
        var responseData = await paymentIntentStatus(payment_intent);
        return responseData["status"];
      };

      status()
        .then((data) => {
          if (data == "succeeded") {
            dispatch(
              setToastify({
                status: ToastStatus.success,
                message: "Your plan was changed successfully.",
              })
            );
          } else {
            dispatch(
              setToastify({
                status: ToastStatus.failed,
                message: "An error occured while updating your plan",
              })
            );
          }
        })
        .catch((err) => {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: "An error occurred while updating your plan" + err,
            })
          );
        })
        .finally(() => {
          router.replace(`\/settings\/${category}`);
        });
    }
  }, [
    dispatch,
    category,
    payment_intent,
    price_id,
    router,
    subscription,
    success,
    teamId,
  ]);

  if (paymentProcess) {
    return (
      <>
        <h1>Payment Processing...</h1>
      </>
    );
  } else if (roleInTeam === TeamMemberRole.member) {
    return (
      <div className="rounded-lg w-full px-2 py-3 bg-gray-200 flex justify-center items-center space-x-3">
        <div>
          <LockClosedIcon
            className="text-gray-400 w-5 h-5"
            aria-hidden="true"
          />
        </div>
        <p className="text-gray-700 text-md font-medium text-center">
          {t(
            "team:To_view_or_modify_billing_options_please_talk_to_your_account_owner"
          )}
        </p>
      </div>
    );
  } else {
    return (
      <>
        {!!businessId && (
          <div className="block mb-3 sm:flex justify-center items-center bg-red-600 px-2 py-2 text-normal text-gray-100 font-medium">
            <div className="flex justify-center items-start sm:items-center px-2">
              <p>Looking for the API billing?</p>
            </div>
            <Link href="/settings/api-billing" shallow>
              <a className="underline flex justify-center items-center font-bold hover:text-red-100">
                <span>Go here</span>
                <ArrowSmRightIcon className="w-7" />
              </a>
            </Link>
          </div>
        )}
        <YourPlan />
        {subscription?.default_card?.brand &&
          subscription?.default_card?.last4 && (
            <div className="mt-3">
              <PaymentMethod />
            </div>
          )}
        {!!stripe_customer_id && subscription?.stripe_subscription_id && (
          <div className="mt-3">
            <PreviousInvoices />
          </div>
        )}
        {lifeTimePlan && lifeTimePlan?.length > 0 && (
          <div className="mt-3">
            <LifeTimePlan lifeTimePlan={lifeTimePlan} />
          </div>
        )}
        <div className="mt-3">
          <OneTimeCreditSlider />
        </div>
      </>
    );
  }
}

const mapStateToPros = (state) => {
  return {
    subscription: state.user?.subscription,
    lifeTimePlan: state.user?.lifeTimePlan,
    roleInTeam: state.user?.role_in_team ?? TeamMemberRole.owner,
    plans: state.options?.plans,
    stripe_customer_id: state.user?.stripe_customer_id,
    businessId: state.user?.business_id,
  };
};

export default connect(mapStateToPros)(PlanBilling);
