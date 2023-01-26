import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getProjects, Project } from "../../api/project";
import DashboardHeader from "../../components/customer/dashboard/dashboardHeader";
import SideNavBar from "../../components/customer/dashboard/sideNavbar";
import EmptyProject from "../../components/customer/emptyProject";
import Overlay from "../../components/customer/overlay";
import { setProjects as setProjectsAction } from "../../store/main/actions";
import { clearAllCookie } from "../../utils/auth";
import clearReduxStore from "../../utils/clearReduxtStore";
import rootCustomerLinks from "../../utils/rootCutomerLink";

function IndexPage({
  projects,
  hasDoneTour_1,
  isProductFruitsReady,
}: {
  projects: Project[];
  hasDoneTour_1: boolean;
  isProductFruitsReady: boolean;
}) {
  const [isLoading, setLoading] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const router = useRouter();
  const { teamId, customerId } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    function switchPage(projects: Project[]) {
      if (projects.length > 0) {
        router.push(
          customerId
            ? `${rootCustomerLinks(customerId)}\/project\/${
                projects[0].id
              }\/new-copy\/all`
            : teamId
            ? `\/${teamId}\/project\/${projects[0].id}\/new-copy\/all`
            : `\/project\/${projects[0].id}\/new-copy\/all`,
          undefined,
          { shallow: true }
        );
      } else if (mounted.current) {
        setLoading(false);
      }
    }

    async function init() {
      if (!projects) {
        try {
          if (mounted.current) {
            setLoading(true);
          }
          const newProjects = await getProjects({ teamId, customerId });
          await dispatch(setProjectsAction(newProjects));
          switchPage(newProjects);
        } catch (err) {
          clearAllCookie();
          clearReduxStore(dispatch);
          router.push("login", undefined, { shallow: true });
        }
      } else {
        switchPage(projects);
      }
    }
    init();
  }, [customerId, dispatch, hasDoneTour_1, projects, router, teamId]);

  useEffect(() => {
    if (isLoading || hasDoneTour_1 || !isProductFruitsReady) {
      return;
    }
    try {
      window["productFruits"]?.api?.tours.tryStartTour(
        process.env.NEXT_PUBLIC_TOUR_1_ID
      );
    } catch (err) {}
  }, [hasDoneTour_1, isLoading, isProductFruitsReady]);

  return (
    <>
      <Head>
        <title>Writesonic</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavBar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <DashboardHeader />
          {isLoading ? (
            <div className="relative w-full h-full">
              <Overlay />
            </div>
          ) : (
            <EmptyProject />
          )}
        </div>
      </div>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    projects: state.main?.projects,
    hasDoneTour_1: state?.user?.has_done_tour_1 ?? true,
  };
};
export default connect(mapStateToPros)(IndexPage);
