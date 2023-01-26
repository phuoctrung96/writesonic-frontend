import authRequest from "../../utils/authRequest";
import { XEngine } from "../admin/engine";

const baseUrl = "/business";

export interface BusinessSummary {
  subscription_funds: number;
  one_time_funds: number;
  usage_this_month: number;
  usage_to_day: number;
}

export interface BusinessSummaryPerType {
  total: number;
  data: {
    content_name: string;
    funds: number;
    generations: number;
    rate: number;
  }[];
}

export interface BusinessBallance {
  one_time_funds: number;
  subscription_funds: number;
}

export interface XCreditHistorySummaryFilterOptions {
  month: string;
  engines: [XEngine];
}

export const getBusinessApiKey = (business_id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const params = { business_id };
    authRequest({ url: `${baseUrl}/get-api-key`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const isBusinessPurchased = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/is-purchased`, method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getBusinessSummary = (
  business_id: string
): Promise<BusinessSummary> => {
  return new Promise((resolve, reject) => {
    const params = { business_id };
    authRequest({ url: `${baseUrl}/get-summary`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getBusinessSummaryPerType = (data: {
  business_id: string;
  month: string;
  x_engine_id: string | number;
}): Promise<BusinessSummaryPerType> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/get-summary-per-type`,
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

export const getSummaryFilterOptions = (
  business_id: string
): Promise<XCreditHistorySummaryFilterOptions[]> => {
  return new Promise((resolve, reject) => {
    const params = { business_id };
    authRequest({
      url: `${baseUrl}/get-summary-filter-options`,
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

export const getCurrentBallance = (
  business_id: string
): Promise<BusinessBallance> => {
  return new Promise((resolve, reject) => {
    const params = { business_id };
    authRequest({
      url: `${baseUrl}/get-current-ballance`,
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
