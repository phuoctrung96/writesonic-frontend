import { ReactElement } from "react";
import authRequest from "../utils/authRequest";

export interface Language {
  label: string | ReactElement;
  value: string;
  icon?: string;
}

export interface TonOfVoice {
  label: string;
  value: string;
}

export interface OneTimeCredit {
  id: string;
  price_id: string;
  credits: number;
  price: number;
}

export interface SlayerModel {
  label: string | ReactElement;
  value: string;
}
export interface SlayerEnabled {
  slayer_enabled: Array<string>;
}
export const getLanguages = (): Promise<Language[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/lists/languages",
      method: "get",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getTonOfVoices = (): Promise<TonOfVoice[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/lists/tone-of-voices",
      method: "get",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getOneTimeCredits = (): Promise<OneTimeCredit[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/lists/one-time-credits",
      method: "get",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getSlayerModels = (): Promise<SlayerModel[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/lists/slayer_models",
      method: "get",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getSlayerEnabled = (): Promise<SlayerEnabled> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/lists/slayer_enabled",
      method: "get",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};
