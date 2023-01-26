import Head from "next/head";
import EngineDetail from "../../../components/admin/contents/business_api/engineDetail";
import DashboardHeader from "../../../components/admin/dashboardHeader";
import SideNavBar from "../../../components/admin/sideNavbar";

function EngineDetailPage() {
  return (
    <>
      <Head>
        <title>Engine</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavBar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-auto relative">
          <DashboardHeader />
          <EngineDetail />
        </div>
      </div>
    </>
  );
}
export default EngineDetailPage;
