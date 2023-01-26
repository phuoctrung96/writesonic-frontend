import authRequest from "../../utils/authRequest";
import { CreditHistoryInterfacePerType } from "./creditHistory";

const baseUrl = "/admin/x-credit-history";

export interface XCreditHistoryThisMonth {
  x_engine_id: string;
  x_engine_name: string;
  number_of_generation: number;
  total_cost: number;
}

export const getSummaryThisMonth = (): Promise<XCreditHistoryThisMonth[]> => {
  const size = 5;
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/summary-this-month`,
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

export const getAllForThisMonthPerType = (
  owner_id: string,
  page: number
): Promise<{
  items: CreditHistoryInterfacePerType[];
  total: number;
  page: number;
  size: number;
}> => {
  const size = 5;
  return new Promise((resolve, reject) => {
    const params = {
      page,
      size,
    };
    authRequest({
      url: `${baseUrl}/all-for-this-month-per-type/${owner_id}`,
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
