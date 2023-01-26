import {
  GENERATING_VARIATION,
  INIT_WRITING_ASSISTANT,
  SET_ACTIVE_RANGE,
  SET_AVAILABLE_VALUES,
  SET_COUNT_WORDS,
  SET_CURRENT_RANGE,
  SET_FORM_PANEL_REF,
  SET_GENERATED_DATA,
  SET_IS_SHOW_FORM_PANEL,
  SET_IS_SHOW_POPUP_MENU,
  SET_IS_SHOW_VARIATION_PANEL,
  SET_IS_STREAM_GENERATING,
  SET_LANGUAGE,
  SET_QUILL,
  SET_SELECT_VARIATION_HISTORY,
  SET_VARIATION,
} from "./actions";

const INITIAL_STATE = {
  quill: null,
  currentRange: null,
  activeRange: null,
  variation: null,
  isGeneratingVariation: false,
  isShowVariationPanel: false,
  isShowFormPanel: true,
  isShowPopupMenu: false,
  selectVariationHistory: [],
  countWords: 0,
  // form panel
  generatedData: null,
  // limit data
  availableValues: null,
  formPanelRef: null,
  isStreamGenerating: false,
  language: "en",
};

export default function writingAssistant(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_WRITING_ASSISTANT:
      return INITIAL_STATE;
    case SET_QUILL:
      return { ...state, quill: action.payload };
    case SET_CURRENT_RANGE:
      return { ...state, currentRange: action.payload };
    case SET_ACTIVE_RANGE:
      return { ...state, activeRange: action.payload };
    case SET_VARIATION:
      return { ...state, variation: action.payload };
    case GENERATING_VARIATION:
      return { ...state, isGeneratingVariation: action.payload };
    case SET_IS_SHOW_VARIATION_PANEL:
      return { ...state, isShowVariationPanel: action.payload };
    case SET_IS_SHOW_FORM_PANEL:
      return { ...state, isShowFormPanel: action.payload };
    case SET_IS_SHOW_POPUP_MENU:
      return { ...state, isShowPopupMenu: action.payload };
    case SET_SELECT_VARIATION_HISTORY:
      return { ...state, selectVariationHistory: action.payload };
    case SET_COUNT_WORDS:
      return { ...state, countWords: action.payload };
    case SET_GENERATED_DATA:
      return { ...state, generatedData: action.payload };
    case SET_AVAILABLE_VALUES:
      return { ...state, availableValues: action.payload };
    case SET_FORM_PANEL_REF:
      return { ...state, formPanelRef: action.payload };
    case SET_IS_STREAM_GENERATING:
      return { ...state, isStreamGenerating: action.payload };
    case SET_LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
}
