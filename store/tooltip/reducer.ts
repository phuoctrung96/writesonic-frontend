import { SET_TOOL_TIP_CONTENT } from "./actions";

const INITIAL_STATE = {
  content: null,
};

export default function tooltip(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_TOOL_TIP_CONTENT:
      return { ...state, content: action.payload };
    default:
      return state;
  }
}
