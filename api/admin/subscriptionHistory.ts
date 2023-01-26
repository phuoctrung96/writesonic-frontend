import authRequest from "../../utils/authRequest";
import { SubscriptionPlan, SubscriptionProduct } from "../credit_v2";

const baseUrl = "/admin/subscription-history";

export interface SubscriptionHistory {
  id: string;
  created_date: string;
  subscription_plan: SubscriptionPlan;
  subscription_product?: SubscriptionProduct;
}

export const getAllSubscriptionHistory = (params: {
  owner_id: string;
}): Promise<SubscriptionHistory[]> => {
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
