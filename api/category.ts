import authRequest from "../utils/authRequest";
import { ContentTypeGrouped, localeContent } from "./contentType";

const baseUrl = "/content-category";

export interface Category {
  id: number;
  package_name: string;
  name: localeContent;
  color: string;
  order: number;
  content_types: ContentTypeGrouped[];
}

export const getCategories = (): Promise<Category[]> => {
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
