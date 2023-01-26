import authRequest from "../../utils/authRequest";

const baseUrl = "/admin/x-rate";

export interface XRate {
  id: string;
  content_type: string;
  amount: number;
}

export const updateRate = (data: {
  id: string;
  amount: number;
}): Promise<XRate> => {
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
