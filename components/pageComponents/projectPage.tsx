import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Category, getCategories } from "../../api/category";
import { getProjects, Project } from "../../api/project";
import projectNavItems from "../../data/projectNavItems";
import useCurrentProject from "../../hooks/useCurrentProject";
import ChromeWelcome from "../../pages/chrome-welcome";
import { setCategories, setProjects } from "../../store/main/actions";
import { setProjectNavItems } from "../../store/options/actions";
import { clearAllCookie } from "../../utils/auth";
import clearReduxStore from "../../utils/clearReduxtStore";
import rootCustomerLinks from "../../utils/rootCutomerLink";
import DashboardHeader from "../customer/dashboard/dashboardHeader";
import SideNavbar from "../customer/dashboard/sideNavbar";
import ProjectContent from "../customer/dashboardContent/projectContent";

function ProjectPage({
  categories,
  projects,
  navItems,
  hasDoneTour_2,
  isProductFruitsReady,
}: {
  categories: Category[];
  projects: Project[];
  navItems: any[];
  hasDoneTour_2: boolean;
  isProductFruitsReady: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { teamId, customerId, pageName } = router.query;
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const [currentProject] = useCurrentProject();
  const [chromeExtCookie, setChromeExtCookie] = useState("");

  useEffect(() => {
    setChromeExtCookie(Cookies.get("web-source"));
  }, []);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      hasDoneTour_2 ||
      !isProductFruitsReady ||
      !categories?.length ||
      !projects?.length
    ) {
      return;
    }
    try {
      window["productFruits"]?.api?.tours.tryStartTour(
        process.env.NEXT_PUBLIC_TOUR_2_ID
      );
    } catch (err) {}
  }, [
    categories?.length,
    hasDoneTour_2,
    isProductFruitsReady,
    projects?.length,
  ]);

  useEffect(() => {
    async function initProjects() {
      //   get projects
      try {
        const newProjects = await getProjects({ teamId, customerId });
        if (!newProjects.length) {
          router.push(
            customerId
              ? rootCustomerLinks(customerId)
              : teamId
              ? `/${teamId}`
              : "/",
            undefined,
            { shallow: true }
          );
        }
      } catch (err) {
        clearAllCookie();
        clearReduxStore(dispatch);
        router.push("login", undefined, { shallow: true });
      }
    }
    if (!projects) {
      initProjects();
    }
  }, [customerId, dispatch, projects, router, teamId]);

  useEffect(() => {
    async function initCategories() {
      //   get categories
      try {
        const data = await getCategories();
        dispatch(setCategories(data));
      } catch (err) {
        console.error(err);
      }
    }
    if (categories === null) {
      initCategories();
    }
  }, [dispatch, categories]);

  useEffect(() => {
    async function initNavItems() {
      const { locale } = router;
      const projectItems = await projectNavItems(locale);
      dispatch(setProjectNavItems(projectItems));
    }
    if (!navItems.length) {
      initNavItems();
    }
  }, [dispatch, navItems.length, router]);

  useEffect(() => {
    async function init() {
      if (!projects) {
        try {
          const newProjects = await getProjects({ teamId, customerId });
          await dispatch(setProjects(newProjects));
        } catch (err) {
          clearAllCookie();
          clearReduxStore(dispatch);
          router.push("login", undefined, { shallow: true });
        }
      }
    }
    init();
  }, [customerId, dispatch, projects, router, teamId]);

  return (
    <>
      {chromeExtCookie ? (
        <ChromeWelcome />
      ) : (
        <>
          <Head>
            <title>{t("common:project")}</title>
          </Head>
          <div className="flex-1 flex overflow-hidden bg-root">
            <SideNavbar className="hidden md:flex md:flex-shrink-0" />
            <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
              <DashboardHeader header={currentProject?.name ?? ""} />
              <ProjectContent />
            </div>
          </div>
        </>
      )}
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    categories: state.main?.categories,
    projects: state.main?.projects,
    toastify: state.main?.toastify,
    navItems: state.options?.projectNavItems ?? [],
    hasDoneTour_2: state?.user?.has_done_tour_2 ?? true,
  };
};
export default connect(mapStateToPros)(ProjectPage);
