import { Plan } from "../../api/credit_v2";
import {
  Language,
  OneTimeCredit,
  SlayerEnabled,
  SlayerModel,
  TonOfVoice,
} from "../../api/list";

export const INIT_OPTIONS: string = "INIT_OPTIONS";
export const SET_LANGUAGES: string = "SET_LANGUAGES";
export const SET_SLAYER_MODELS: string = "SET_SLAYER_MODELS";
export const SET_TON_OF_VOICES: string = "SET_TON_OF_VOICES";
export const SET_PLANS: string = "SET_PLANS";
export const SET_ONE_TIME_CREDITS: string = "SET_ONE_TIME_CREDITS";
export const SET_PROJECT_NAV_ITEMS: string = "SET_PROJECT_NAV_ITEMS";
export const SET_SETTING_NAV_ITEMS: string = "SET_SETTING_NAV_ITEMS";
export const SET_SLAYER_ENABLED: string = "SET_SLAYER_ENABLED";
export const initOptions = () => {
  return { type: INIT_OPTIONS };
};

export const setLanguages = (items: Language[]) => (dispatch) => {
  let languages = [];
  items.forEach((language) => {
    languages.push({
      value: language.value.toLowerCase(),
      label: (
        <div className="flex items-center">
          <span
            className={`flag-icon flag-icon-${language.icon} w-5 h-5 mr-2`}
          ></span>
          {language.label}
        </div>
      ),
    });
  });
  dispatch({ type: SET_LANGUAGES, payload: languages });
};
export const setSlayerModels = (items: SlayerModel[]) => (dispatch) => {
  let slayerModels = [];
  items.forEach((model) => {
    slayerModels.push({
      value: model.value.toLowerCase(),
      label: <div className="flex items-center">{model.label}</div>,
    });
  });
  dispatch({ type: SET_SLAYER_MODELS, payload: slayerModels });
};

export const setSlayerEnabled = (item: SlayerEnabled) => (dispatch) => {
  let slayerEnabled: Array<string> = [];
  item["slayer_enabled"].map((item) => {
    slayerEnabled.push(item);
  });

  dispatch({ type: SET_SLAYER_ENABLED, payload: slayerEnabled });
};

export const setTonOfVoices = (tones: TonOfVoice[]) => async (dispatch) => {
  dispatch({ type: SET_TON_OF_VOICES, payload: tones });
};

export const setPlans = (plans: Plan[]) => async (dispatch) => {
  dispatch({ type: SET_PLANS, payload: plans });
};

export const setOneTimeCredits =
  (plans: OneTimeCredit[]) => async (dispatch) => {
    dispatch({ type: SET_ONE_TIME_CREDITS, payload: plans });
  };

export const setProjectNavItems = (items) => {
  return { type: SET_PROJECT_NAV_ITEMS, payload: items };
};

export const setSettingNavItems = (items) => {
  return { type: SET_SETTING_NAV_ITEMS, payload: items };
};
