import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import React from "react";
import CannyFeedback from "../cannyFeedback/cannyFeedback";
import DashboardHeader from "../customer/dashboard/dashboardHeader";
import SideNavbar from "../customer/dashboard/sideNavbar";

const FeedbackPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("common:settings")}</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavbar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
          <DashboardHeader header={t("common:Request_a_feature") + " ✨"} />
          <div className="block w-full p-8 overflow-scroll">
            <CannyFeedback />
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;
