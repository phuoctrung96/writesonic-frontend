import authRequest from "../utils/authRequest";

const baseUrl = "semrush";

export interface SemrushSearchOutput {
  columnNames?: string[];
  rows?: string[][];
}

export const semrushLoginByCode = (params: { code: string | string[] }) => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/login-by-code`,
      method: "get",
      params,
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

export const disconnectSemrush = () => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/disconnect`,
      method: "post",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const searchRephrase = (params: {
  search_key: string;
  database_code: string;
  keyword_type: string;
}) => {
  return new Promise<SemrushSearchOutput>((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/search-phrase`,
      method: "get",
      params,
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
