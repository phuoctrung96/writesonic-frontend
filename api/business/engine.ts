import authRequest from "../../utils/authRequest";
import { XEngine } from "../admin/engine";

const baseUrl = "/x-engine";
const SIZE = 5;

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
