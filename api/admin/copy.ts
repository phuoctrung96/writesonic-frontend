import authRequest from "../../utils/authRequest";

const baseUrl = "/admin/copies";

interface OutputAverageRating {
  average: number;
  count: number;
}

export interface OutputRating {
  id: string;
  template_name: string;
  average_per_month: OutputAverageRating;
  average_per_week: OutputAverageRating;
}

export const getRatings = (
  page: number
): Promise<{
  items: OutputRating[];
  total: number;
  page: number;
  size: number;
}> => {
  return new Promise((resolve, reject) => {
    const params = {
      page,
      size: 5,
    };
    authRequest({
      url: `${baseUrl}/ratings`,
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
