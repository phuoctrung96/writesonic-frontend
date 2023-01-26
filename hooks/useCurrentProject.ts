import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProject, Project } from "../api/project";
import rootCustomerLinks from "../utils/rootCutomerLink";

const useCurrentProject = (): [Project] => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { projectId, teamId, customerId } = router.query;
  const projects = useSelector((state: any) => state.main.projects);
  const [project, setProject] = useState<Project>(null);
  useEffect(() => {
    if (projects?.length) {
      setProject(projects?.find(({ id }) => id === projectId));
    } else {
      getProject({ projectId, teamId, customerId })
        .then((project) => {
          setProject(project);
        })
        .catch((err) => {
          // dispatch(
          //   setToastify({
          //     status: ToastStatus.failed,
          //     message: getErrorMessage(err),
          //   })
          // );
          router.push(
            customerId
              ? rootCustomerLinks(customerId)
              : teamId
              ? `\/${teamId}`
              : "/",
            undefined,
            { shallow: true }
          );
        });
    }
  }, [customerId, dispatch, projectId, projects, router, teamId]);

  return [project];
};

export default useCurrentProject;
