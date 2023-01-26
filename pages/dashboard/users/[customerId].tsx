import Head from "next/head";
import UserDetail from "../../../components/admin/contents/website/userDetail";
import DashboardHeader from "../../../components/admin/dashboardHeader";
import SideNavBar from "../../../components/admin/sideNavbar";

function UserDetailPage() {
  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavBar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-auto relative">
          <DashboardHeader />
          <UserDetail />
        </div>
      </div>
    </>
  );
}
export default UserDetailPage;
