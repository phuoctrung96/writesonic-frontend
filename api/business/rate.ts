import authRequest from "../../utils/authRequest";
import { XRate } from "../admin/rate";

const baseUrl = "/x-rate";
const SIZE = 5;

export const getRatesByEngine = (
  engine_id: string | number
): Promise<XRate[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/get-all-by-engine`,
      method: "get",
      params: { engine_id },
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
