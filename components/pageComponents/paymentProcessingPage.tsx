import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isBusinessPurchased } from "../../api/business/business";
import { getBusinessSubscription, getSubscription } from "../../api/credit_v2";
import { checkUpdatedOneTimeCredits } from "../../api/user";
import { SettingNavItems } from "../../data/settingNavItems";
import { setToastify, ToastStatus } from "../../store/main/actions";
import {
  getLeftCredits,
  setBusinessSubscription,
  setSubscription,
} from "../../store/user/actions";
import getErrorMessage from "../../utils/getErrorMessage";
import SideNavbar from "../customer/dashboard/sideNavbar";
import Overlay from "../customer/overlay";

const SUBSCRIPTION: string = "subscription";
const BUSINESS_SUBSCRIPTION: string = "business-subscription";
const ONE_TIME_PURCHASE: string = "one-time-purchase";
const ONE_TIME_PURCHASE_BUSINESS: string = "one-time-purchase-business";

const DELAY_TIME: number = 5 * 1000;
const MAX_NUMBERS: number = 6;

const PaymentProcessingPage: React.FC = () => {
  const router = useRouter();
  const { category, teamId } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      category !== SUBSCRIPTION &&
      category !== BUSINESS_SUBSCRIPTION &&
      category !== ONE_TIME_PURCHASE &&
      category !== ONE_TIME_PURCHASE_BUSINESS
    ) {
      router.push(teamId ? `/${teamId}` : "/", undefined, { shallow: true });
    }
  }, [category, router, teamId]);

  useEffect(() => {
    async function handleChanged(ctg: string | string[]) {
      let message = "";
      switch (ctg) {
        case SUBSCRIPTION:
          message = "Payment successful";
          break;
        case BUSINESS_SUBSCRIPTION:
          message = "Business Payment successful";
          break;
        case ONE_TIME_PURCHASE:
          message = "You purchased credits successfully";
          break;
        case ONE_TIME_PURCHASE_BUSINESS:
          message = "You purchased api credits successfully";
          break;
      }

      await dispatch(getLeftCredits(teamId));
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message,
        })
      );
      if (ctg === ONE_TIME_PURCHASE_BUSINESS || ctg === BUSINESS_SUBSCRIPTION) {
        router.push(`/settings/${SettingNavItems.apiBilling}`, undefined, {
          shallow: true,
        });
      } else {
        router.push(
          teamId
            ? `/${teamId}/settings/${SettingNavItems.billing}`
            : `/settings/${SettingNavItems.billing}`,
          undefined,
          { shallow: true }
        );
      }
      clearInterval(timeId);
    }

    async function handleUnChanged() {
      if (
        category === ONE_TIME_PURCHASE_BUSINESS ||
        category === BUSINESS_SUBSCRIPTION
      ) {
        router.push(`/settings/${SettingNavItems.apiBilling}`, undefined, {
          shallow: true,
        });
      } else {
        router.push(
          teamId
            ? `/${teamId}/settings/${SettingNavItems.billing}`
            : `/settings/${SettingNavItems.billing}`,
          undefined,
          { shallow: true }
        );
      }
      clearInterval(timeId);
    }

    let number = 0;
    const timeId = setInterval(async () => {
      number++;
      if (number > MAX_NUMBERS) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message:
              "Sorry, we couldn't process your payment at this time. Please contact our support team.",
          })
        );
        handleUnChanged();
        return;
      }
      try {
        switch (category) {
          case SUBSCRIPTION:
            const subscription = await getSubscription({ teamId });
            if (subscription !== null) {
              dispatch(setSubscription(subscription));
              await handleChanged(category);
            }
            break;
          case BUSINESS_SUBSCRIPTION:
            const xSubscription = await getBusinessSubscription({
              customerId: null,
            });
            if (xSubscription !== null) {
              dispatch(setBusinessSubscription(xSubscription));
              await handleChanged(category);
            }
          case ONE_TIME_PURCHASE:
            const isUpdatedOneTimeCredits = await checkUpdatedOneTimeCredits(
              teamId
            );
            if (isUpdatedOneTimeCredits) {
              await handleChanged(category);
            }
            break;
          case ONE_TIME_PURCHASE_BUSINESS:
            const isPurchased = await isBusinessPurchased();
            if (isPurchased) {
              await handleChanged(category);
            }
            break;
        }
      } catch (err) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
        router.push(teamId ? `/${teamId}` : "/", undefined, { shallow: true });
      }
    }, DELAY_TIME);

    return () => {
      clearInterval(timeId);
    };
  }, [category, dispatch, router, teamId]);

  return (
    <>
      <Head>
        <title>Writesonic</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavbar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
          <Overlay message="Processing your payment..." />;
        </div>
      </div>
    </>
  );
};

export default PaymentProcessingPage;
