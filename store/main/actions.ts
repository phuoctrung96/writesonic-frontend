import { NextRouter } from "next/router";
import { Category } from "../../api/category";
import { Project } from "../../api/project";
import rootCustomerLinks from "../../utils/rootCutomerLink";
import {
  openCreateProjectModal,
  openDeleteProjectModal,
} from "../modals/actions";

export const SET_PROJECTS: string = "SET_PROJECTS";
export const SET_CATEGORIES: string = "SET_CATEGORIES";
export const SELECT_CATEGORY: string = "SELECT_CATEGORY";
export const SET_TOAST: string = "SET_TOAST";
export const SET_DASHBOARD_SEARCH_KEY = "SET_DASHBOARD_SEARCH_KEY";
export const INIT_MAIN: string = "INIT_MAIN";

export enum ToastStatus {
  success,
  warning,
  failed,
}

export interface ToastInfo {
  status: ToastStatus;
  message: string;
}

export const initMain = () => {
  return { type: INIT_MAIN };
};

export const setProjects = (projects: Project[]) => (dispatch) => {
  dispatch({ type: SET_PROJECTS, payload: projects });
};

export const setCategories = (categories: Category[]) => (dispatch) => {
  dispatch({ type: SET_CATEGORIES, payload: categories });
};

export const createProject =
  (project: Project) => async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_PROJECTS,
        payload: [...getState().main.projects, project],
      });
      dispatch(openCreateProjectModal(false));
    } catch (err) {}
  };

export const renameProject =
  (project: Project) => async (dispatch, getState) => {
    try {
      const projects = getState().main.projects.map((item) => {
        if (item.id === project.id) {
          item.name = project.name;
        }
        return item;
      });

      dispatch({
        type: SET_PROJECTS,
        payload: projects,
      });
      dispatch(openCreateProjectModal(false));
    } catch (err) {}
  };

export const deleteProject =
  (project: Project, router: NextRouter) => (dispatch, getState) => {
    try {
      const { projects } = getState().main;
      const { teamId, customerId, projectId } = router.query;
      let index = -1;
      const newProjects = projects.filter((item, idx) => {
        if (item.id === project.id) {
          index = idx;
        }
        return item.id !== project.id;
      });
      dispatch({
        type: SET_PROJECTS,
        payload: newProjects,
      });
      if (projectId === project.id && newProjects.length) {
        const project = index > 0 ? newProjects[index - 1] : newProjects[0];
        router.push(
          customerId
            ? `${rootCustomerLinks(customerId)}\/project\/${
                project.id
              }\/new-copy\/all`
            : teamId
            ? `\/${teamId}\/project\/${project.id}\/new-copy\/all`
            : `\/project\/${project.id}\/new-copy\/all`,
          undefined,
          { shallow: true }
        );
      } else if (projectId === project.id) {
        router.push(
          customerId
            ? rootCustomerLinks(customerId)
            : teamId
            ? `\/${teamId}`
            : "/",
          undefined,
          { shallow: true }
        );
      }
      dispatch(openDeleteProjectModal(null));
    } catch (err) {}
  };

export const setToastify = (toast: ToastInfo) => {
  return { type: SET_TOAST, payload: toast };
};

export const setDashboardSearchKey = (value: string) => {
  return { type: SET_DASHBOARD_SEARCH_KEY, payload: value };
};
