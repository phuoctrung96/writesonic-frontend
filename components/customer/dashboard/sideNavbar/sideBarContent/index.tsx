import { LightningBoltIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { SubscriptionV2 } from "../../../../../api/credit_v2";
import { Project } from "../../../../../api/project";
import { UserRole } from "../../../../../api/user";
import book_man from "../../../../../public/images/book_man.svg";
import logo_white from "../../../../../public/images/logo_white.png";
import note from "../../../../../public/images/note.jpg";
import SmPinkButton from "../../../../buttons/smPinkButton";
import EarnFreeCreditsNav from "./earnFreeCreditsNav";
import FeedbackNav from "./feedbackNav";
import GroupContentNav from "./groupContentNav";
import SelectProject from "./selectProject";
import SettingNav from "./settingNav";

function SideBarContent({
  projects,
  firstName,
  allCredits,
  planName,
  isUnlimited,
  subscription,
  myRole,
  customerRole,
  businessId,
  message,
}: {
  projects: Project[];
  firstName: string;
  allCredits: number;
  planName: string;
  isUnlimited: boolean;
  subscription: SubscriptionV2;
  myRole: UserRole;
  customerRole: UserRole;
  businessId: string;
  message?: string;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { query, pathname } = router;
  const { teamId, customerId } = query;
  const { t, lang } = useTranslation();
  const [isShowRequestFeedback, setIsShowRequestFeedback] =
    useState<boolean>(false);

  useEffect(() => {
    const isViewAsCustomer = router.pathname.includes(
      "/dashboard/users/[customerId]/virtual"
    );
    if (subscription?.is_active) {
      setIsShowRequestFeedback(true);
    } else if (
      (customerRole === UserRole.super_admin ||
        customerRole === UserRole.admin) &&
      isViewAsCustomer
    ) {
      setIsShowRequestFeedback(true);
    } else if (
      (myRole === UserRole.super_admin || myRole === UserRole.admin) &&
      !isViewAsCustomer
    ) {
      setIsShowRequestFeedback(true);
    } else {
      setIsShowRequestFeedback(false);
    }
  }, [customerRole, myRole, router.pathname, subscription?.is_active]);
  return (
    <>
      <div className="flex items-center flex-shrink-0 px-4 py-4 border-b border-purple-100 border-opacity-20">
        <Link href="/">
          <a>
            <Image src={logo_white} alt="logo" width={124} height={32} />
          </a>
        </Link>
      </div>
      <div className="mt-2 flex-1 flex flex-col">
        {router.pathname.includes(
          "/project/[projectId]/[pageName]/[contentCategory]"
        ) &&
          !!projects.length && <SelectProject />}
        {router.pathname.includes("/project/[projectId]/group/[groupId]") && (
          <GroupContentNav message={message} />
        )}
        {(router.pathname === "/settings/[category]" ||
          router.pathname === "/[teamId]/settings/[category]" ||
          router.pathname === "/settings/[category]/[integrationCategory]" ||
          router.pathname ===
            "/[teamId]/settings/[category]/[integrationCategory]") && (
          <SettingNav />
        )}
        {(router.pathname === "/earn-free-credits" ||
          router.pathname === "/[teamId]/earn-free-credits") && (
          <EarnFreeCreditsNav />
        )}
        {(router.pathname === "/feedback" ||
          router.pathname === "/[teamId]/feedback") && <FeedbackNav />}
      </div>

      {router.pathname !== "/payment-processing/[pageName]" && (
        <div className="px-4 py-4">
          <div>
            {!!businessId && (
              <div className="py-1">
                <Link
                  href={
                    teamId
                      ? `\/${teamId}\/settings/api-usage`
                      : "/settings/api-usage"
                  }
                  shallow
                >
                  <a className="font-medium text-base text-white hover:text-gray-300 transition-color cursor-pointer">
                    {t("side_bar:api_dashboard")} 🖥️
                  </a>
                </Link>
              </div>
            )}
            <Link href="https://writesonic.com/affiliate" shallow>
              <a target="_blank" rel="noreferrer">
                <Image
                  src={note}
                  alt="Affiliate Program"
                  width={200}
                  height={80}
                />
              </a>
            </Link>
            <div className="py-1">
              <p className="font-medium text-base text-white hover:text-gray-300 transition-color">
                <Link href="https://writesonic.com/affiliate" shallow>
                  <a target="_blank" rel="noreferrer">
                    🥰 Earn 30% Lifetime Commission as an Affiliate!
                  </a>
                </Link>
              </p>
            </div>
            <div className="py-1">
              <p className="font-medium text-base text-white hover:text-gray-300 transition-color">
                <Link href="https://help.writesonic.com" shallow>
                  <a target="_blank" rel="noreferrer">
                    {t("side_bar:resources")} 📚
                  </a>
                </Link>
              </p>
            </div>
            <div className="py-1">
              <Link
                href={
                  teamId
                    ? `\/${teamId}\/earn-free-credits`
                    : "/earn-free-credits"
                }
                shallow
              >
                <a className="font-medium text-base text-white hover:text-gray-300 transition-color cursor-pointer">
                  {t("side_bar:earn_free_credits")} 🔥
                </a>
              </Link>
            </div>
            {/* {isShowRequestFeedback && ( */}
            <div className="py-1">
              <Link
                href={teamId ? `\/${teamId}\/feedback` : "/feedback"}
                shallow
              >
                <a className="font-medium text-base text-white hover:text-gray-300 transition-color cursor-pointer">
                  {t("common:Request_a_feature")} ✨
                </a>
              </Link>
            </div>
            {/* )} */}
            {/* <div className="py-1">
              <a
                href="https://fresh-cormorant-aad.notion.site/Public-Roadmap-42f22203097b4abeaeab3cd1874c8c9e"
                target="_blank"
                rel="noreferrer"
                className="flex items-center font-medium text-sm text-white hover:text-gray-300 transition-color"
              >
                Roadmap
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15px"
                  height="15px"
                  viewBox="0 0 36 36"
                  className="ml-2"
                >
                  <path
                    fill="#A0041E"
                    d="M1 17l8-7 16 1 1 16-7 8s.001-5.999-6-12-12-6-12-6z"
                  />
                  <path
                    fill="#FFAC33"
                    d="M.973 35s-.036-7.979 2.985-11S15 21.187 15 21.187 14.999 29 11.999 32c-3 3-11.026 3-11.026 3z"
                  />
                  <circle fill="#FFCC4D" cx="8.999" cy="27" r="4" />
                  <path
                    fill="#55ACEE"
                    d="M35.999 0s-10 0-22 10c-6 5-6 14-4 16s11 2 16-4c10-12 10-22 10-22z"
                  />
                  <path d="M26.999 5c-1.623 0-3.013.971-3.641 2.36.502-.227 1.055-.36 1.641-.36 2.209 0 4 1.791 4 4 0 .586-.133 1.139-.359 1.64 1.389-.627 2.359-2.017 2.359-3.64 0-2.209-1.791-4-4-4z" />
                  <path
                    fill="#A0041E"
                    d="M8 28s0-4 1-5 13.001-10.999 14-10-9.001 13-10.001 14S8 28 8 28z"
                  />
                </svg>
              </a>
            </div> */}
          </div>
          <div className="bg-indigo-0 rounded-md relative">
            <div className="mt-2 p-6">
              <div>
                {planName && (
                  <p className="font-medium text-xs text-dashboard-side-item uppercase opacity-40">
                    plan: {planName[router.locale]}
                  </p>
                )}
                <p className="pt-4 pb-20 text-lg font-normal text-dashboard-side-item">
                  {t("common:hi")} {firstName}!<br></br>
                  {t("side_bar:you_have")}
                  <br></br>
                  {isUnlimited ? "Unlimited" : allCredits}
                  <span
                    className="ml-1"
                    dangerouslySetInnerHTML={{
                      __html: t("common:credits_left"),
                    }}
                  />
                </p>
              </div>
              <div className="absolute right-0 bottom-0 flex items-end">
                <Image src={book_man} alt="book man" width={180} height={180} />
              </div>
            </div>
          </div>
          {!customerId &&
            subscription?.subscription_product?.name["en"] !== "Agency" && (
              <Link
                href={
                  teamId
                    ? `\/${teamId}\/settings\/billing`
                    : "/settings/billing"
                }
                shallow
              >
                <a className="flex justify-center items-center w-full">
                  <SmPinkButton className="w-full mt-3 focus:ring-offset-indigo-900">
                    <LightningBoltIcon className="h-4 w-4 text-white mr-1" />
                    {t("side_bar:upgrade_now")}
                  </SmPinkButton>
                </a>
              </Link>
            )}
        </div>
      )}
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    allCredits:
      (state.user?.credits?.one_time_credits ?? 0) +
      (state.user?.credits?.recurring_credits ?? 0) +
      (state.user?.credits?.lifetime_deal_credits ?? 0) +
      (state.user?.credits?.reward_credits ?? 0),
    isUnlimited: state.user?.credits?.is_unlimited ?? false,
    firstName: state.user?.firstName,
    planName: state.user?.subscription?.subscription_product?.name ?? "",
    projects: state.main?.projects ?? [],
    subscription: state.user?.subscription,
    myRole: state.user?.role ?? UserRole.member,
    customerRole: state.user?.customer_role,
    businessId: state.user?.business_id,
  };
};

export default connect(mapStateToPros)(SideBarContent);
