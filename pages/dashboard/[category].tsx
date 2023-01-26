import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { UserRole } from "../../api/user";
import Contents from "../../components/admin/contents";
import DashboardHeader from "../../components/admin/dashboardHeader";
import SideNavBar from "../../components/admin/sideNavbar";

interface DashboardProps {
  role: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const router = useRouter();
  const { teamId } = router.query;
  const [title, setTitle] = useState("Dashboard");

  useEffect(() => {
    if (role === UserRole.member) {
      router.push(teamId ? `/${teamId}` : "/");
    }
  }, [role, router, teamId]);

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
          <Contents />
        </div>
      </div>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    role: state.user?.role,
  };
};

export default connect(mapStateToPros)(Dashboard);
