import authRequest from "../utils/authRequest";

const baseUrl = "/default-card";

export const checkUpdatedDefaultCard = (
  team_id: string | string[]
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({
      url: `${baseUrl}/is-updated`,
      method: "get",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
