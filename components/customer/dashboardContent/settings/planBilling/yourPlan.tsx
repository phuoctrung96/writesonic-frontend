import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  cancellationEmail,
  createCheckoutSubscription,
  PREMIUM_PLAN_NAME,
  SubscriptionPlan,
  SubscriptionProduct,
  SubscriptionV2,
} from "../../../../../api/credit_v2";
import { TeamMemberRole } from "../../../../../api/team";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import {
  openConfirmCancelPlanModal,
  openConfirmChangePlanModal,
} from "../../../../../store/modals/actions";
import {
  getSubscription,
  reactSubscription,
} from "../../../../../store/user/actions";
import convertTimezone from "../../../../../utils/convertTimezone";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import { openHelpScout } from "../../../../../utils/helpScout";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import PlanFormV2 from "../../../../planFormV2";
import Overlay from "../../../overlay";
import ConfirmCancelPlanModal from "./confirmCancelPlanModal";
import ConfirmChangePlanModal from "./confirmChangePlanModal";
import PaypalButtonWrapper from "./paypalButtonWrapper";
import SelectPaymentMethod, { ID_STRIPE } from "./selectPaymentMethod";

function YourPlan({
  subscription,
  roleInTeam,
  stripeCustomerId,
}: {
  subscription: SubscriptionV2;
  roleInTeam: TeamMemberRole;
  stripeCustomerId: String;
}) {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;
  const { teamId } = router.query;

  const [coupon, setCoupon] = useState<string>("null");
  const [product, setProduct] = useState<SubscriptionProduct>(null);
  const [plan, setPlan] = useState<SubscriptionPlan>(null);
  const [isLoading, setLoading] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<string>(ID_STRIPE);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [isInitializingPaypalButton, setIsInitializingPaypalButton] =
    useState<boolean>(false);
  const [isShowContactSupportButton, setIsShowContactSupportButton] =
    useState<boolean>(false);
  const [isReactivating, setIsReactivating] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsShowContactSupportButton(
      subscription &&
        !(
          subscription?.subscription_product?.name["en"] ===
            PREMIUM_PLAN_NAME && product?.name["en"] === PREMIUM_PLAN_NAME
        ) &&
        ((subscription?.subscription_product?.name["en"] ===
          PREMIUM_PLAN_NAME &&
          product?.name["en"] != PREMIUM_PLAN_NAME &&
          product?.name["en"] != "Basic") ||
          (subscription?.subscription_product?.name["en"] !== "Premium" &&
            subscription?.subscription_product?.name["en"] !== "Basic" &&
            product?.name["en"] == PREMIUM_PLAN_NAME))
    );
  }, [product?.name, subscription]);

  useEffect(() => {
    if ((subscription || !plan?.paypal_plan_id) && plan?.stripe_price_id) {
      setCurrentPayment(ID_STRIPE);
    }
  }, [plan?.paypal_plan_id, plan?.stripe_price_id, subscription]);
  const onSubmit = async () => {
    try {
      if (subscription) {
        dispatch(openConfirmChangePlanModal(true));
      } else {
        setLoading(true);
        const checkoutUrl = await createCheckoutSubscription(
          plan.id,
          coupon,
          window["Rewardful"]?.referral ?? "",
          teamId
        );

        window.location.href = checkoutUrl;
      }
    } catch (err) {
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const openHelpScoutUtil = () => {
    try {
      window["Beacon"]("open");
    } catch (err) {}
  };

  const onCancel = () => {
    if (
      !subscription.stripe_subscription_id &&
      subscription.paypal_subscription_id
    ) {
      // cancel paypal plan
      dispatch(openConfirmCancelPlanModal(true));
      return;
    }
    // cancel stripe plan
    try {
      window["churnkey"].init("show", {
        subscriptionId: subscription.stripe_subscription_id, // optional
        customerId: stripeCustomerId, // required
        authHash: subscription.auth_hash, // required
        appId: process.env.NEXT_PUBLIC_CHURNKEY_APP_ID, // required
        mode: process.env.NODE_ENV === "development" ? "test" : "live", // set to 'test' to hit Stripe test environment
        record: true, // set to false to skip session playback recording,
        handleSupportRequest: (customer) => {
          window["Beacon"]("prefill", {
            subject: "[PRIORITY] Need help with subscription",
            text: "Hey team, I need some help with my subscription.",
          });
          window["Beacon"]("config", {
            docsEnabled: false,
          });
          openHelpScout();
          window["churnkey"].hide();
        },
        onCancel: (customer, surveyResponse) => {
          dispatch(getSubscription({ teamId }));
          const survey_response = surveyResponse;
          return new Promise(async (resolve, reject) => {
            try {
              // Send cancel subscription email
              await cancellationEmail(survey_response);
              resolve("Acknowledged Cancel Subscription Email");
            } catch (e) {
              reject(e);
            }
          });
        },
        onPause: (customer, { pauseDuration }) => {
          dispatch(getSubscription({ teamId }));
        },
      });
    } catch (err) {}
  };

  const handleReactiveSubscription = async () => {
    try {
      setIsReactivating(true);
      await dispatch(reactSubscription());
      router.reload();
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsReactivating(false);
      }
    }
  };

  return (
    <>
      <Block
        title={
          roleInTeam === TeamMemberRole.owner
            ? t("settings:your_plan")
            : "Team Plan"
        }
        message={t("settings:your_plan_description")}
      >
        <div className="mt-5">
          {/* {!subscription && <PromotionBannerNoButton />} */}
          {!!subscription?.paypal_subscription_id && (
            <p className="my-2 text-sm text-red-500 mb-6">
              (If you upgrade/downgrade your plan, your current plan&apos;s
              prorated amount will be refunded and new plan will be charged at
              full amount right after that.)
            </p>
          )}
          <PlanFormV2
            plan={plan}
            setPlan={setPlan}
            product={product}
            setProduct={setProduct}
            coupon={coupon}
            setCoupon={setCoupon}
            currentPayment={currentPayment}
          />
        </div>
        {!(teamId && subscription?.paypal_subscription_id) && plan && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {!!!subscription && (
              <div className="col-span-1">
                <SelectPaymentMethod
                  currentId={currentPayment}
                  setCurrentId={setCurrentPayment}
                  plan={plan}
                />
              </div>
            )}
            <div className="col-span-3 flex w-full items-center">
              {currentPayment === ID_STRIPE ? (
                <>
                  {plan && (
                    <>
                      {subscription?.subscription_plan?.id ===
                      plan?.id ? null : (
                        <>
                          {isShowContactSupportButton ? (
                            <SmPinkButton
                              className="w-full"
                              onClick={() => openHelpScoutUtil()}
                            >
                              Contact Support
                            </SmPinkButton>
                          ) : (
                            <SmPinkButton
                              className="w-full"
                              onClick={onSubmit}
                              disabled={isLoading}
                            >
                              {subscription
                                ? t("settings:change_plan_btn")
                                : t("settings:subscribe_btn")}
                            </SmPinkButton>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {subscription &&
                    subscription?.subscription_plan?.id === plan?.id && (
                      <>
                        {subscription?.cancel_at_period_end && (
                          <div className="w-full">
                            <p className="text-normal text-sm text-gray-500 py-2">
                              Your plan is scheduled to be cancelled on{" "}
                              {convertTimezone(
                                subscription?.cancel_date,
                                locale
                              )}
                            </p>
                            <SmPinkButton
                              className="w-full"
                              onClick={handleReactiveSubscription}
                              disabled={isReactivating}
                            >
                              Reactivate your subscription
                            </SmPinkButton>
                          </div>
                        )}
                        {!!subscription?.pause_collection && (
                          <SmPinkButton
                            className="w-full"
                            onClick={handleReactiveSubscription}
                            disabled={isReactivating}
                          >
                            Resume your Subscription
                          </SmPinkButton>
                        )}
                        {!subscription?.cancel_at_period_end &&
                          !subscription?.pause_collection && (
                            <p className="text-sm text-gray-500">
                              Would you like to{" "}
                              <a
                                className="underline text-indigo-600 hover:text-red-500 cursor-pointer"
                                onClick={onCancel}
                              >
                                cancel
                              </a>{" "}
                              your subscription?
                            </p>
                          )}
                      </>
                    )}
                </>
              ) : (
                <div className="w-full z-0">
                  <PayPalScriptProvider
                    options={{
                      "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                      components: "buttons",
                      intent: "subscription",
                      vault: true,
                    }}
                  >
                    <PaypalButtonWrapper
                      paypalPlanId={plan.paypal_plan_id}
                      setIsSubscribing={setIsSubscribing}
                      setIsInitializingPaypalButton={
                        setIsInitializingPaypalButton
                      }
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>
          </div>
        )}
      </Block>
      {plan && (
        <ConfirmChangePlanModal plan={plan} product={product} coupon={coupon} />
      )}
      <ConfirmCancelPlanModal />
      <Overlay isShowing={isSubscribing || isInitializingPaypalButton} />
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    subscription: state.user?.subscription,
    roleInTeam: state.user?.role_in_team ?? TeamMemberRole.owner,
    stripeCustomerId: state.user?.stripe_customer_id,
  };
};

export default connect(mapStateToPros)(YourPlan);
