import classNames from "classnames";
import { init } from "commandbar";
import { useRouter } from "next/dist/client/router";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAdblockDetector } from "react-adblock-detector";
import { connect, useDispatch } from "react-redux";
import {
  Credits,
  getBusinessSubscription,
  getSubscription,
  SubscriptionV2,
  XSubscription,
} from "../api/credit_v2";
import { getMyTeams, TeamInfo } from "../api/team";
import { getProfile, sessionLogout, UserRole } from "../api/user";
import { WRITING_ASSISTANT_KEY } from "../data/exceptData";
import { setToastify, ToastStatus } from "../store/main/actions";
import { openSwitchAccountModal } from "../store/modals/actions";
import {
  setBusinessSubscription,
  setSubscription,
  setTeams,
  setUser,
} from "../store/user/actions";
import acceptInvite from "../utils/acceptInvite";
import { clearAllCookie } from "../utils/auth";
import clearReduxStore from "../utils/clearReduxtStore";
import {
  identifyHelpScout,
  logoutHelpScout,
  suggestPageChangeEventToHelpSCout,
} from "../utils/helpScout";
import isUUID from "../utils/isUUID";
import GenericBanner from "./banners/genericBanner";
import PaymentFailedBanner from "./banners/paymentFailedBanner";
import ConfirmDeleteModal from "./customer/modals/confirmDeleteModal";
import CreateProjectModal from "./customer/modals/createProjectModal";
import RenameProjectModal from "./customer/modals/renameProjectModal";
import SwitchAccountModal from "./customer/modals/switchAccountModal";
import ChatBot from "./customer/onboardingWidget";
import Overlay from "./customer/overlay";
import WritingAssistantHelp from "./customer/writingAssistantHelp";
import ProfileSideBar from "./profileSideBar";
import ProjectSidebar from "./projectSidebar";

const ProductFruits = dynamic(() => import("react-product-fruits"), {
  ssr: false,
}) as React.FC<{ projectCode: string; language: string }>;

interface AppInterface {
  Component: any;
  pageProps: any;
  myId: string;
  myEmail: string;
  myFirstName: string;
  myLastName: string;
  teams: TeamInfo[];
  subscription: SubscriptionV2;
  xSubscription: XSubscription;
  myLanguage: string;
  myPhotoUrl: string;
  myCredits: Credits;
  stripeCustomerId: string;
  xStripeCustomerId: string;
  isProductFruitsReady: boolean;
  allData?: any;
}

const App: React.FC<AppInterface> = ({
  Component,
  pageProps,
  myId,
  myEmail,
  myFirstName,
  myLastName,
  teams,
  subscription,
  xSubscription,
  myLanguage,
  myPhotoUrl,
  myCredits,
  stripeCustomerId,
  xStripeCustomerId,
  isProductFruitsReady,
  allData,
}) => {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query, pathname } = router;
  const { teamId, invite_id, invitedId, customerId, contentType, projectId } =
    query;
  const [isLoading, setLoading] = useState(true);
  const [isFetchingSubscription, setIsFetchingSubscription] =
    useState<boolean>(true);
  const [isAdblockCheckComplete, isAdblockerDetected] = useAdblockDetector();

  // command bar
  init(process.env.NEXT_PUBLIC_COMMANDBAR_ID);
  const loggedInUserId = myId;
  window.CommandBar.boot(loggedInUserId);

  const userInfo = {
    username: myId,
    email: myEmail,
    firstname: myFirstName,
    lastname: myLastName,
    props: {},
  };

  const goToHome = useCallback(() => {
    clearReduxStore(dispatch);
    router.push("/", undefined, { shallow: true });
  }, [dispatch, router]);

  useEffect(() => {
    const routerFunc = (newUrl) => router.push(newUrl);
    window.CommandBar.addRouter(routerFunc);
  }, [router]);

  // CommandBar Contexts
  useEffect(() => {
    window.CommandBar.addContext("name", myFirstName);
    window.CommandBar.addContext("email", myEmail);
    window.CommandBar.addContext("userCredits", () => allData?.user?.credits);
    window.CommandBar.addCallback("myCredits", () => allData?.user?.credits);
    window.CommandBar.addContext("role", allData?.user?.role);
    window.CommandBar.addContext("role_in_team", allData?.user?.role_in_team);

    window.CommandBar.addContext("projectId", projectId);
    window.CommandBar.addContext("customerId", customerId);
    window.CommandBar.addContext("teamId", teamId ? teamId : null);
    window.CommandBar.addCallback("logOutUser", () => {
      sessionLogout(router.locale);
      window.CommandBar.shutdown();
      logoutHelpScout();
      clearAllCookie();
      clearReduxStore(dispatch);
      router.push("/login");
    });
  }, [
    allData,
    customerId,
    dispatch,
    myCredits,
    myEmail,
    myFirstName,
    myLanguage,
    projectId,
    router,
    teamId,
  ]);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const teams = await getMyTeams();
        dispatch(
          setTeams([
            {
              team_id: "mine",
              team_name: "",
              owner_id: myId,
              owner_email: myEmail,
              owner_first_name: myFirstName ?? "",
              owner_last_name: myLastName ?? "",
            },
            ...teams,
          ])
        );
      } catch (err) {}
    }
    if (
      !teams &&
      myId &&
      myEmail &&
      pathname !== "/dashboard/[category]" &&
      pathname !== "/dashboard/users/[id]" &&
      pathname !== "/dashboard/x-users/[id]"
    ) {
      fetchTeams();
    }
  }, [dispatch, myEmail, myFirstName, myId, myLastName, pathname, teams]);

  useEffect(() => {
    if (teams && teams?.length > 1) {
      dispatch(openSwitchAccountModal(true));
    }
  }, [dispatch, teams, teams?.length]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (teamId && !isUUID(teamId)) {
      goToHome();
      return;
    }
    let timeId = null;
    async function init() {
      const is_view_as_customer = router.pathname.includes(
        "/dashboard/users/[customerId]/virtual"
      );
      if (myId && !is_view_as_customer) {
        setLoading(false);
        return;
      }
      try {
        let user = null;
        let subscription = null;
        let businessSubscription = null;
        if (is_view_as_customer) {
          user = await getProfile({
            teamId,
            customerId,
          });
          subscription = await getSubscription({ teamId, customerId });
          businessSubscription = await getBusinessSubscription({ customerId });
        } else {
          user = await getProfile({
            teamId,
          });
          subscription = await getSubscription({ teamId });
          businessSubscription = await getBusinessSubscription({
            customerId: null,
          });
        }
        // store user in redux
        dispatch(setUser(user));
        dispatch(setSubscription(subscription));
        dispatch(setBusinessSubscription(businessSubscription));
        const { email_verified: emailVerified, phone_verified: phoneVerified } =
          user;

        if (mounted.current) {
          setIsFetchingSubscription(false);
        }

        // get invited id
        let invId: string | string[] = "";
        if (invite_id) {
          invId = invite_id;
        } else if (invitedId) {
          invId = invitedId;
        }

        // check if email is verified and phone verified
        if (!emailVerified) {
          router.push(
            !invId ? "/confirm-email" : `/join/${invId}/confirm-email`,
            undefined,
            { shallow: true }
          );
          clearReduxStore(dispatch);
          return;
        } else if (!phoneVerified) {
          router.push(
            !invId ? "/verify-phone" : `/join/${invId}/verify-phone`,
            undefined,
            { shallow: true }
          );
          clearReduxStore(dispatch);
          return;
        }
        // handle invitation
        if (invite_id) {
          await acceptInvite({ invitedId: invite_id, dispatch, router });
        }
        if (customerId && user.role === UserRole.member) {
          router.push("/", undefined, { shallow: true });
          return;
        }
      } catch (err) {
        clearAllCookie();
        if (err?.message == "Network Error") {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: "Server Error",
            })
          );
          return;
        }
        if (invite_id) {
          router.push(`\/join\/${invite_id}\/signup`, undefined, {
            shallow: true,
          });
        } else if (invitedId) {
          router.push(`\/join\/${invitedId}\/signup`, undefined, {
            shallow: true,
          });
        } else {
          router.push("/login", undefined, { shallow: true });
        }
      } finally {
        timeId = setTimeout(() => {
          if (mounted.current) {
            setLoading(false);
          }
        }, 2000);
      }
    }

    init();

    return () => {
      clearTimeout(timeId);
    };
  }, [
    customerId,
    dispatch,
    goToHome,
    invite_id,
    invitedId,
    myId,
    router,
    teamId,
  ]);

  useEffect(() => {
    const handleRouteChange = (url?: any) => {
      if (!myId) {
        return;
      }
      // Identify Users in Segment
      window["analytics"]?.identify(myId, {
        firstName: myFirstName,
        lastName: myLastName,
        email: myEmail,
        language: myLanguage,
        stripe_price_id: subscription?.subscription_plan?.stripe_price_id,
        paypal_plan_id: subscription?.subscription_plan?.paypal_plan_id,
        price: subscription?.subscription_plan?.price,
        planName: subscription?.subscription_product?.name["en"],
      });
    };
    handleRouteChange();
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [
    myEmail,
    myFirstName,
    myId,
    myLanguage,
    myLastName,
    router.events,
    subscription?.subscription_plan?.paypal_plan_id,
    subscription?.subscription_plan?.price,
    subscription?.subscription_plan?.stripe_price_id,
    subscription?.subscription_product?.name,
  ]);

  useEffect(() => {
    if (
      isFetchingSubscription ||
      !myEmail ||
      !myFirstName ||
      !myId ||
      !myLanguage ||
      !myLastName ||
      !myPhotoUrl ||
      !router.locale
    ) {
      return;
    }
    identifyHelpScout({
      name: `${myFirstName} ${myLastName}`,
      email: myEmail,
      "admin-dashboard-url": `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/users/${myId}`,
      avatar: myPhotoUrl,
      language: myLanguage,
      discount: subscription
        ? (subscription?.discount_percent_off === 100
            ? 0
            : 100 - subscription?.discount_percent_off
          ).toString() + "%"
        : "",
      "subscription-credits": myCredits?.recurring_credits,
      "lifetime-deal-credits": myCredits?.lifetime_deal_credits,
      "one-time-credits": myCredits?.one_time_credits,
      "subscription-plan-name":
        subscription?.subscription_product?.name[router.locale] ?? "",
      "normal-stripe-customer-url": stripeCustomerId
        ? `https://dashboard.stripe.com/customers/${stripeCustomerId}`
        : "",
      "api-stripe-customer-url": xStripeCustomerId
        ? `https://dashboard.stripe.com/customers/${xStripeCustomerId}`
        : "",
    });
  }, [
    isFetchingSubscription,
    myCredits?.lifetime_deal_credits,
    myCredits?.one_time_credits,
    myCredits?.recurring_credits,
    myEmail,
    myFirstName,
    myId,
    myLanguage,
    myLastName,
    myPhotoUrl,
    router.locale,
    stripeCustomerId,
    subscription,
    xStripeCustomerId,
  ]);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${router.asPath}`;
    const title = document.title;
    if (!title) {
      return;
    }
    suggestPageChangeEventToHelpSCout(url, title);
  }, [router]);

  if (isLoading) {
    return <Overlay />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* {!isFetchingSubscription && !subscription && <HolidayBanner />} */}
      {/* {!isFetchingSubscription && !subscription && <PromotionBanner />} */}
      <GenericBanner />
      {subscription && !subscription.is_active && <PaymentFailedBanner />}
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="relative">
          <ProfileSideBar setLoading={setLoading} />
          <ProjectSidebar />
          <SwitchAccountModal />
          <CreateProjectModal />
          <RenameProjectModal />
          <ConfirmDeleteModal />
        </div>
        {contentType === WRITING_ASSISTANT_KEY ? (
          <WritingAssistantHelp
            className={classNames(
              "absolute right-6 z-50 transition-all delay-500 bottom-12",
              router.pathname === "/template/[projectId]/[contentType]"
            )}
          />
        ) : (
          <ChatBot
            className={classNames(
              "absolute right-6 z-50 transition-all delay-500",
              contentType === WRITING_ASSISTANT_KEY &&
                router.pathname === "/template/[projectId]/[contentType]"
                ? "bottom-16 hidden sm:block "
                : "bottom-6"
            )}
          />
        )}

        <Component
          {...pageProps}
          isProductFruitsReady={isProductFruitsReady}
          isAdblockCheckComplete={isAdblockCheckComplete}
          isAdblockerDetected={isAdblockerDetected}
        />
        {/* Disable productFruit Tutor */}
        {/* {global.window && (
          <ProductFruits
            projectCode={process.env.NEXT_PUBLIC_PRODUCT_FRUITS_PROJECT_CODE}
            language="en"
            {...userInfo}
          />
        )} */}
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    myId: state?.user?.id,
    myEmail: state?.user?.email,
    myFirstName: state?.user?.firstName,
    myLastName: state?.user?.lastName,
    myLanguage: state?.user?.language ?? "en",
    myPhotoUrl: state?.user?.photo_url ?? "",
    myCredits: state?.user?.credits ?? {
      recurring_credits: 0,
      lifetime_deal_credits: 0,
      one_time_credits: 0,
    },
    teams: state.user?.teams,
    subscription: state?.user?.subscription,
    xSubscription: state?.user?.x_subscription,
    stripeCustomerId: state?.user?.stripe_customer_id,
    xStripeCustomerId: state?.user?.x_stripe_customer_id,
    allData: state,
  };
};

export default connect(mapStateToPros)(App);
