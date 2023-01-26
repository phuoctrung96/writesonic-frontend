import authRequest from "../../utils/authRequest";
import { Plan } from "../credit_v2";

const baseUrl = "/admin/x-plan-history";

export interface XPlanHistory {
  id: string;
  created_date: string;
  x_plan: Plan;
}

export const getAllXPlanHistory = (params: {
  owner_id: string;
}): Promise<XPlanHistory[]> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/all`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};
