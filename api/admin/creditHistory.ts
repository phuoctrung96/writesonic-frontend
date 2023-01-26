import authRequest from "../../utils/authRequest";

const baseUrl = "/admin/credit-history";

export interface CreditHistoryInterfacePerType {
  id: string;
  content_name: string;
  total_cost: number;
  total_generation: number;
  avg_cost: number;
}

export interface CreditHistoryInterface {
  subscription: number;
  lifetime: number;
  free: number;
}

export interface GenerationOutput {
  generations: number;
  credits: number;
}

export interface CreditHistoryThisMonth {
  open_ai_engine: string;
  number_of_generation: number;
  total_cost: number;
}

export const getAllForThisMonthPerType = (
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
      url: `${baseUrl}/all-for-this-month-per-type`,
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

export const getAllForTodayPerType = (
  page: number
): Promise<{
  items: CreditHistoryInterfacePerType[];
  total: number;
  page: number;
  size: number;
}> => {
  const size = 5;
  const params = {
    page,
    size,
  };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all-for-today-per-type`,
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

export const getAllForThisMonth = (): Promise<CreditHistoryInterface> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all-for-this-month`,
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

export const getAllForToday = (): Promise<CreditHistoryInterface> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all-for-today`,
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

export const getGenerationsForToday = (params: {
  owner_id: string;
}): Promise<GenerationOutput> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/generations-for-today`,
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

export const getSummaryThisMonth = (): Promise<CreditHistoryThisMonth[]> => {
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

export const getSummaryToday = (): Promise<CreditHistoryThisMonth[]> => {
  const size = 5;
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/summary-today`,
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
