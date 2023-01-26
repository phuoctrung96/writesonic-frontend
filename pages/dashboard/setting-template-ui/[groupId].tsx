import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SettingTemplatesGroupUI from "../../../components/admin/contents/settinTemplateGroupUI";
import DashboardHeader from "../../../components/admin/dashboardHeader";
import SideNavBar from "../../../components/admin/sideNavbar";

function SettingGroup() {
  const router = useRouter();
  const [title, setTitle] = useState("Dashboard");

  useEffect(() => {
    Object.values((items) => {
      const item = items.find(({ key }) => key === router.query.category);
      if (item) {
        setTitle(item.name);
        return;
      }
    });
  }, [router.query.category]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavBar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-auto relative">
          <DashboardHeader />
          <SettingTemplatesGroupUI />
        </div>
      </div>
    </>
  );
}

export default SettingGroup;
