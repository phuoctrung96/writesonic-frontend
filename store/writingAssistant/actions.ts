import {
  generateCopies,
  getWritingAssistantAvailableValues,
} from "../../api/content";
import {
  RangeInterface,
  SOURCE_WRITING_ASSISTANT_SELECTION,
} from "../../components/customer/template/content/WritingAssistant/editor";
import { compareCopy } from "../../utils/compareCopy";
import getErrorMessage from "../../utils/getErrorMessage";
import { setToastify, ToastStatus } from "../main/actions";

export const INIT_WRITING_ASSISTANT: string = "INIT_WRITING_ASSISTANT";
export const SET_QUILL: string = "SET_QUILL";
export const SET_CURRENT_RANGE: string = "SET_CURRENT_RANGE";
export const SET_ACTIVE_RANGE: string = "SET_ACTIVE_RANGE";
export const SET_VARIATION: string = "SET_VARIATION";
export const GENERATING_VARIATION: string = "GENERATING_VARIATION";
export const SET_IS_SHOW_VARIATION_PANEL: string =
  "SET_IS_SHOW_VARIATION_PANEL";
export const SET_IS_SHOW_FORM_PANEL: string = "SET_IS_SHOW_FORM_PANEL";
export const SET_IS_SHOW_POPUP_MENU: string = "SET_IS_SHOW_POPUP_MENU";
export const SET_SELECT_VARIATION_HISTORY: string =
  "SET_SELECT_VARIATION_HISTORY";
export const SET_COUNT_WORDS: string = "SET_COUNT_WORDS";
export const SET_GENERATED_DATA: string = "SET_GENERATED_DATA";
export const SET_AVAILABLE_VALUES: string = "SET_AVAILABLE_VALUES";
export const SET_FORM_PANEL_REF: string = "SET_FORM_PANEL_REF";
export const SET_IS_STREAM_GENERATING: string = "SET_IS_STREAM_GENERATING";
export const SET_LANGUAGE: string = "SET_LANGUAGE";

export interface GeneratedParam {
  data: { [key: string]: any }[];
  range: RangeInterface;
  endpoint: string;
}

export interface SelectVariationHistory {
  id: string;
  content: string;
  range: RangeInterface;
}

export interface GeneratedData {
  range: RangeInterface;
  inputText: string;
}

export const setAssistantLanguage = (language: string) => {
  return { type: SET_LANGUAGE, payload: language };
};
export const initWritingAssistant = () => {
  return { type: INIT_WRITING_ASSISTANT };
};

export const setQuill = (quill: any) => {
  return { type: SET_QUILL, payload: quill };
};

export const setCurrentRange = (range: RangeInterface) => {
  return { type: SET_CURRENT_RANGE, payload: range };
};

export const setActiveRange = (range: RangeInterface) => {
  return { type: SET_ACTIVE_RANGE, payload: range };
};

export const clearVariation = () => (dispatch) => {
  // hide variation panel
  dispatch(setIsShowVariationPanel(false));
  dispatch(setSelectVariationHistory([]));
  setTimeout(() => {
    dispatch({ type: SET_VARIATION, payload: null });
  }, 300);
};

export const generateVariation =
  ({
    data,
    range,
    teamId,
    projectId,
    endpoint,
    language,
  }: {
    data: { [key: string]: any };
    range: RangeInterface;
    teamId: string | string[];
    projectId: string | string[];
    endpoint: string;
    language: string;
  }) =>
  async (dispatch, getState) => {
    const { writingAssistant } = getState();
    const { quill } = writingAssistant;
    if (!range || !quill) {
      return;
    }
    try {
      quill.blur();
      quill.enable(false);
      dispatch(clearVariation());
      dispatch({ type: GENERATING_VARIATION, payload: true });
      const res = await generateCopies({
        type: endpoint,
        data,
        params: {
          project_id: projectId,
          want_recording: false,
          teamId,
          language: language ?? "en",
        },
        paginate: false,
      });
      if (endpoint === "content-rephrase") {
        res.new_copies.forEach((copy) => {
          copy.data.cmp_text = compareCopy(
            data.content_to_rephrase,
            copy.data.text
          );
        });
      }
      dispatch({
        type: SET_VARIATION,
        payload: { data: res.new_copies, range, endpoint },
      });
      dispatch(setGeneratedData(null));
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
      throw err;
    } finally {
      quill.enable();
      quill.setSelection(range, SOURCE_WRITING_ASSISTANT_SELECTION);
      dispatch({ type: GENERATING_VARIATION, payload: false });
    }
  };

export const setIsShowVariationPanel = (value: boolean) => {
  return { type: SET_IS_SHOW_VARIATION_PANEL, payload: value };
};

export const setIsShowFormPanel = (value: boolean) => {
  return { type: SET_IS_SHOW_FORM_PANEL, payload: value };
};

export const setIsShowPopupMenu = (value: boolean) => {
  return { type: SET_IS_SHOW_POPUP_MENU, payload: value };
};

export const setSelectVariationHistory = (list: SelectVariationHistory[]) => {
  return { type: SET_SELECT_VARIATION_HISTORY, payload: list };
};

export const setCountWords = (count: number) => {
  return { type: SET_COUNT_WORDS, payload: count };
};

export const setGeneratedData = (data: GeneratedData) => {
  return { type: SET_GENERATED_DATA, payload: data };
};

export const setAvailableValues =
  ({
    teamId,
    customerId,
  }: {
    teamId: string | string[];
    customerId: string | string[];
  }) =>
  async (dispatch) => {
    try {
      const data = await getWritingAssistantAvailableValues({
        teamId,
        customerId,
      });
      dispatch({ type: SET_AVAILABLE_VALUES, payload: data });
    } catch (err) {
      dispatch({ type: SET_AVAILABLE_VALUES, payload: null });
    }
  };

export const setFormPanelRef = (ref) => {
  return { type: SET_FORM_PANEL_REF, payload: ref };
};

export const setIsStreamGenerating = (value: boolean) => {
  return { type: SET_IS_STREAM_GENERATING, payload: value };
};
