import authRequest, { isCanceled } from "../utils/authRequest";
import { History } from "./history";

const baseUrl = "/content";

export interface OutputGenerate {
  history_id: string;
  copies: { [key: string]: any }[];
  count: number;
}

export interface WritingAssistantAvailableValues {
  charge_credits: number;
  num_used_today: number;
  max_response_tokens: number;
  max_generations_per_day: number;
}

const SIZE = 5;

export function generateCopies({
  type,
  data,
  params,
  paginate = true,
}: {
  type: string;
  data: { [key: string]: any };
  params: { [key: string]: any };
  paginate?: boolean;
}): Promise<History> {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/${type}`,
      method: "post",
      data,
      params: { ...params, size: SIZE, paginate },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        if (isCanceled(err)) {
          return;
        }
        reject(err);
      });
  });
}

export const getWritingAssistantAvailableValues = ({
  teamId,
  customerId,
}: {
  teamId: string | string[];
  customerId: string | string[];
}): Promise<WritingAssistantAvailableValues> => {
  const params = { team_id: teamId, customer_id: customerId };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/writing-assistant/available-values`,
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

export const biosynthProductDescription = ({
  file,
  params,
}: {
  file: File;
  params: { [key: string]: any };
}) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("excel_file", file);
    authRequest({
      url: `${baseUrl}/biosynth-product-description`,
      method: "post",
      data: formData,
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
