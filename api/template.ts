import authRequest from "../utils/authRequest";

const baseUrl = "/template";
const SIZE = 5;

export const getLandingPage = (data): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/landing-page`,
      method: "post",
      data,
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

export const downloadLandingPageHTML = (data): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/download-landing-page-html`,
      method: "post",
      headers: { "content-type": "application/json" },
      responseType: "blob",
      data,
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
