import authRequest from "../../utils/authRequest";
import { XRate } from "./rate";

const baseUrl = "/admin/x-engine";
const SIZE = 5;

export interface XEngine {
  id: string | number;
  name: string;
  open_ai_engine_name?: string;
  x_rates?: XRate[];
}

export const getAllEngineOptions = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/get-all-options`, method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getAllEngine = (): Promise<XEngine[]> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/get-all`, method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getEngine = (params: { id: string }): Promise<XEngine> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/get`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const createEngine = (data: {
  name: string;
  open_ai_engine_name: string;
}): Promise<XEngine> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/create`, method: "post", data })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateEngine = (data: {
  id: number | string;
  name: string;
  open_ai_engine_name: string;
}): Promise<XEngine> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/update`, method: "post", data })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const deleteEngine = (params: {
  id: string | number;
}): Promise<XEngine> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/remove`, method: "delete", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};
