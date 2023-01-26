import authRequest from "../../utils/authRequest";
import { Interval, SubscriptionProduct } from "../credit_v2";

const baseUrl = "/admin/credit";

export interface UpdateOrderOfProductInput {
  product_id: string;
  order: number;
}

export const getAllPlans = (params: {
  interval: Interval;
}): Promise<SubscriptionProduct[]> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/plans`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateOrderOfProduct = (data: UpdateOrderOfProductInput[]) => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-order-of-products`,
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
