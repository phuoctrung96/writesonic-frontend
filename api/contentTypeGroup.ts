import authRequest from "../utils/authRequest";
import { ContentTypeGroup } from "./admin/contentTypeGroup";

const baseUrl = "/content-type-group";

export const getContentTypeGroup = (params: {
  id: string;
}): Promise<ContentTypeGroup> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/get`,
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
