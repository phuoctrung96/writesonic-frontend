import {
  GENERATING_COPY,
  INIT_TEMPLATE,
  LIKE,
  LOADING_COPY,
  LOADING_HISTORY,
  SET_COPIES,
  SET_INPUTS,
  SET_TEMPLATE,
  SET_TITLE,
} from "./actions";

const INITIAL_STATE = {
  title: "",
  isLiked: false,
  filter: null,
  inputs: null,
  copies: [],
  total: null,
  page: null,
  size: null,
  loadingCopy: false,
  generatingCopy: false,
  loadingHistory: false,
  subHistories: [],
};

export default function projects(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GENERATING_COPY:
      return { ...state, generatingCopy: action.payload };
    case LOADING_COPY:
      return { ...state, loadingCopy: action.payload };
    case LOADING_HISTORY:
      return { ...state, loadingHistory: action.payload };
    case SET_TITLE:
      return { ...state, title: action.payload };
    case LIKE:
      return { ...state, isLiked: action.payload };
    case SET_COPIES:
      return { ...state, copies: action.payload };
    case INIT_TEMPLATE:
      return INITIAL_STATE;
    case SET_INPUTS:
      return { ...state, inputs: action.payload };
    case SET_TEMPLATE:
      const {
        title,
        isLiked,
        filter,
        inputs,
        copies,
        total,
        page,
        size,
        subHistories,
      } = action.payload;
      let newState = {
        ...state,
        filter,
        inputs,
        copies: copies ?? [],
        total,
        page,
        size,
        subHistories: subHistories ?? [],
      };
      if (title !== null) newState = { ...newState, title };
      if (isLiked !== null) newState = { ...newState, isLiked };
      return newState;
    default:
      return state;
  }
}
