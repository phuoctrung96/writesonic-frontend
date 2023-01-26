import authRequest from "../../utils/authRequest";

const baseUrl = "/admin/business";

export const setBusinessActive = (data: {
  id: string;
  is_active: boolean;
}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/set-active`, method: "post", data })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateBusinessEngine = (data: {
  id: string;
  engine_id: string | number;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/update-engine`, method: "post", data })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};
