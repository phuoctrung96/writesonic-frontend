import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import UserDetail from "../../../components/admin/contents/website/userDetail";
import DashboardHeader from "../../../components/admin/dashboardHeader";
import SideNavbar from "../../../components/admin/sideNavbar";

function Dashboard() {
  const router = useRouter();
  const [title, setTitle] = useState("User");

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavbar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-auto relative">
          <DashboardHeader />
          <UserDetail />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
