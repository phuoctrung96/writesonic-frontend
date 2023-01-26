import {
  INIT_OPTIONS,
  SET_LANGUAGES,
  SET_ONE_TIME_CREDITS,
  SET_PLANS,
  SET_PROJECT_NAV_ITEMS,
  SET_SETTING_NAV_ITEMS,
  SET_SLAYER_ENABLED,
  SET_SLAYER_MODELS,
  SET_TON_OF_VOICES,
} from "./actions";

export interface NavItem {
  key: string;
  name: string;
  component: Function;
  childrenItems?: {
    key: string;
    name: string;
    description?: string;
    component: Function;
  }[];
}

const INITIAL_STATE = {
  languages: null,
  tonOfVoices: null,
  projectNavItems: [],
  settingNavItems: [],
  plans: null,
  oneTimeCredits: null,
  slayerEnabled: null,
};

export default function options(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_OPTIONS:
      return INITIAL_STATE;
    case SET_LANGUAGES:
      return { ...state, languages: action.payload };
    case SET_SLAYER_MODELS:
      return { ...state, slayerModels: action.payload };
    case SET_SLAYER_ENABLED:
      return { ...state, slayerEnabled: action.payload };
    case SET_TON_OF_VOICES:
      return { ...state, tonOfVoices: action.payload };
    case SET_PLANS:
      return { ...state, plans: action.payload };
    case SET_ONE_TIME_CREDITS:
      return { ...state, oneTimeCredits: action.payload };
    case SET_PROJECT_NAV_ITEMS:
      return { ...state, projectNavItems: action.payload };
    case SET_SETTING_NAV_ITEMS:
      return { ...state, settingNavItems: action.payload };
    default:
      return state;
  }
}
