import { Dispatch } from "redux";
import { initArticleWriter } from "../store/articleWriter/actions";
import { initMain } from "../store/main/actions";
import { initModals } from "../store/modals/actions";
import { initOptions } from "../store/options/actions";
import { initTemplates } from "../store/template/actions";
import { initUser } from "../store/user/actions";
import { initWritingAssistant } from "../store/writingAssistant/actions";

export default function clearReduxStore(dispatch: Dispatch) {
  dispatch(initUser());
  dispatch(initTemplates());
  dispatch(initOptions());
  dispatch(initModals());
  dispatch(initMain());
  dispatch(initArticleWriter());
  dispatch(initWritingAssistant());
}
