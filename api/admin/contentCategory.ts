import authRequest from "../../utils/authRequest";
import { Category } from "../category";

const baseUrl = "/admin/content-category";

export const getAllCategories = (): Promise<Category[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all`,
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
