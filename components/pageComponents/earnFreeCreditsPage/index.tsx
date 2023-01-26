import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import capterra from "../../../public/images/capterra.png";
import g2 from "../../../public/images/g2.png";
import DashboardHeader from "../../customer/dashboard/dashboardHeader";
import SideNavbar from "../../customer/dashboard/sideNavbar";
import styles from "./index.module.scss";

const Index: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("common:settings")}</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavbar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
          <DashboardHeader header={t("earn_free_credits:Earn_Free_Credits")} />
          <div
            className={classNames(
              styles["earn-free-credits"],
              "bg-earn-free-credits bg-no-repeat w-full flex flex-col w-0 flex-1 overflow-hidden relative px-2 md:px-8 lg:px-20 py-32 overflow-y-auto"
            )}
          >
            <div>
              <p className="text-5xl font-extrabold text-white">
                {t("earn_free_credits:title")}
              </p>
              <p className="text-gray-4 text-xl font-normal mt-8">
                {t("earn_free_credits:description")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 lg:gap-y-8 lg:grid-cols-3 mt-36">
              <CreditNode
                title={t("earn_free_credits:credit_node_title_1")}
                text={t("earn_free_credits:credit_node_text_1")}
                linkTag={t("earn_free_credits:Get_25_Credits")}
                link="https://www.g2.com/products/writesonic/reviews#reviews"
                icon={
                  <>
                    <div className="bg-pink-2 flex justify-center items-center p-3 rounded-lg">
                      <Image src={g2} alt="pg" width="30" height="30" />
                    </div>
                  </>
                }
              />
              <CreditNode
                title={t("earn_free_credits:credit_node_title_2")}
                text={t("earn_free_credits:credit_node_text_2")}
                linkTag={t("earn_free_credits:Get_25_Credits")}
                link="https://reviews.capterra.com/new/219972?utm_source=vp&utm_medium=none&utm_term=&utm_content=&utm_campaign=vendor_request"
                icon={
                  <>
                    <div className="bg-gray-3 flex justify-center items-center px-3 py-1.5 rounded-lg">
                      <Image src={capterra} alt="pg" width="30" height="45" />
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CreditNode: React.FC<{
  title: string;
  text: string;
  linkTag: string;
  icon: ReactNode;
  link: string;
}> = ({ title, text, linkTag, icon, link }) => {
  return (
    <div className="bg-white pt-12 rounded-2xl relative shadow-xl flex flex-grow flex-col">
      <div className="px-6 lg:px-3 xl:px-6 flex-1">
        <p className="text-gray-900 text-lg font-medium">{title}</p>
        <p className="text-gray-500 text-base lg:text-sm xl:text-base font-normal mt-4">
          {text}
        </p>
      </div>
      <p className="text-indigo-700 text-base font-normal bg-gray-50 p-6 mt-6 rounded-b-2xl hover:text-indigo-900">
        <Link href={link} shallow>
          <a target="_blank" rel="noreferrer">
            {linkTag} →
          </a>
        </Link>
      </p>
      <div className="absolute left-6 -top-6">{icon}</div>
    </div>
  );
};

export default Index;
