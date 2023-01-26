import { combineReducers } from "redux";
import articleWriter from "./articleWriter/reducer";
import main from "./main/reducer";
import modals from "./modals/reducer";
import options from "./options/reducer";
import template from "./template/reducer";
import tooltip from "./tooltip/reducer";
import user from "./user/reducer";
import writingAssistant from "./writingAssistant/reducer";
export default combineReducers({
  user,
  main,
  options,
  modals,
  template,
  articleWriter,
  tooltip,
  writingAssistant,
});
