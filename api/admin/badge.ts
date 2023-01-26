import authRequest from "../../utils/authRequest";

const baseUrl = "/admin/badge";

export interface BadgeData {
  id?: number;
  name: string;
  text_color: string;
  background_color: string;
}

export const getAllBadges = (): Promise<BadgeData[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/list`,
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

export const createBadge = (data: BadgeData): Promise<BadgeData> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/create`,
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

export const updateBadge = (data: BadgeData): Promise<BadgeData> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update`,
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

export const removeBadge = (id: string | number): Promise<BadgeData> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/delete/${id}`,
      method: "delete",
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
