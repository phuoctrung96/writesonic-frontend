import {
  INIT_MAIN,
  SET_CATEGORIES,
  SET_DASHBOARD_SEARCH_KEY,
  SET_PROJECTS,
  SET_TOAST,
} from "./actions";

const INITIAL_STATE = {
  projects: null,
  categories: null,
  toastify: null,
  dashboardSearchKey: "",
};

export default function main(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_MAIN:
      return INITIAL_STATE;
    case SET_PROJECTS:
      return { ...state, projects: action.payload };
    case SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case SET_TOAST:
      return { ...state, toastify: action.payload };
    case SET_DASHBOARD_SEARCH_KEY:
      return { ...state, dashboardSearchKey: action.payload };
    default:
      return state;
  }
}
