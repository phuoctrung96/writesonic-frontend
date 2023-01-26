import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { ContentTypeGroup } from "../../api/admin/contentTypeGroup";
import { getContentTypeGroup } from "../../api/contentTypeGroup";
import { getProjects, Project } from "../../api/project";
import useCurrentProject from "../../hooks/useCurrentProject";
import {
  setProjects as setProjectsAction,
  setToastify,
  ToastStatus,
} from "../../store/main/actions";
import getErrorMessage from "../../utils/getErrorMessage";
import DashboardHeader from "../customer/dashboard/dashboardHeader";
import SideNavbar from "../customer/dashboard/sideNavbar";
import ChildNewCopy from "../customer/dashboardContent/projectContent/childNewCopy";

const GroupNewCopyPage: React.FC<{
  projects: Project[];
}> = ({ projects }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, customerId, groupId } = query;
  const dispatch = useDispatch();
  const [contentTypeGroup, setContentTypeGroup] =
    useState<ContentTypeGroup>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentProject] = useCurrentProject();

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function init() {
      if (!projects) {
        try {
          const newProjects = await getProjects({ teamId, customerId });
          await dispatch(setProjectsAction(newProjects));
        } catch (err) {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: getErrorMessage(err),
            })
          );
        }
      }
    }
    init();
  }, [customerId, dispatch, projects, router, teamId]);

  useEffect(() => {
    if (!groupId || typeof groupId !== "string") {
      return;
    }
    setIsLoading(true);
    getContentTypeGroup({ id: groupId })
      .then((data) => {
        if (mounted.current) {
          setContentTypeGroup(data);
        }
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setIsLoading(false);
        }
      });
  }, [dispatch, groupId]);

  return (
    <>
      <Head>
        <title>{t("common:project")}</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavbar
          className="hidden md:flex md:flex-shrink-0"
          message={contentTypeGroup?.title[locale]}
        />
        <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
          <DashboardHeader />
          <ChildNewCopy
            contentTypeGroup={contentTypeGroup}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    projects: state.main?.projects,
  };
};

export default connect(mapStateToPros)(GroupNewCopyPage);
