import authRequest from "../utils/authRequest";
import { ContentType } from "./contentType";

const baseUrl = "/copies";

export interface CopyData {
  id: string;
  title: string;
  description: string;
  is_liked: boolean;
  inputs_data: { [key: string]: any };
  copy_data?: Copy;
  time: string;
  history_id: number;
  content_type: ContentType;
}

export interface Copy {
  id?: string;
  title?: string;
  description?: string;
  is_saved?: boolean;
  time?: string;
  data?: { [key: string]: any };
  rating?: number;
  slayer_score: number;
  highlighted_data?: { [key: string]: any };
}

export const getSavedCopies = ({
  teamId,
  projectId,
  categoryName,
  searchKey,
  page,
  customerId,
}: {
  teamId: string | string[];
  projectId: string | string[];
  categoryName: string | string[];
  searchKey: string;
  page: number;
  customerId: string | string[];
}): Promise<{
  items: CopyData[];
  total: number;
  page: number;
  size: number;
}> => {
  return new Promise((resolve, reject) => {
    let params = {
      team_id: teamId,
      project_id: projectId,
      category_name: categoryName,
      search_key: searchKey,
      page,
      size: 9,
      customer_id: customerId,
    };
    authRequest({
      url: `${baseUrl}/all-saved`,
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

export const getSavedCopy = ({
  copyId,
  customerId,
  projectId,
  teamId,
}: {
  copyId: string | string[];
  customerId: string | string[];
  projectId: string | string[];
  teamId: string | string[];
}): Promise<CopyData> => {
  return new Promise((resolve, reject) => {
    const params = {
      id: copyId,
      project_id: projectId,
      customer_id: customerId,
      team_id: teamId,
    };
    authRequest({
      url: `${baseUrl}/saved`,
      method: "get",
      params: params,
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

export function saveCopy({
  copyId,
  customerId,
  teamId,
}: {
  copyId: string | string[];
  customerId: string | string[];
  teamId: string | string[];
}): Promise<Copy> {
  return new Promise((resolve, reject) => {
    const data = {
      copy_id: copyId,
    };
    const params = { customer_id: customerId, team_id: teamId };
    authRequest({
      url: `${baseUrl}/save`,
      method: "post",
      data,
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
}

export function unSaveCopy({
  copyId,
  customerId,
  teamId,
}: {
  copyId: string | string[];
  customerId: string | string[];
  teamId: string | string[];
}): Promise<Copy> {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/unsave?copy_id=${copyId}`,
      method: "post",
      params: {
        customer_id: customerId,
        team_id: teamId,
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
}

export function changeCopy({
  copyId,
  copyData,
  rating,
  customerId,
  teamId,
  isUpdateDate = true,
}: {
  copyId: string | string[];
  copyData: { [key: string]: string };
  rating: number;
  customerId: string | string[];
  teamId: string | string[];
  isUpdateDate?: boolean;
}): Promise<Copy> {
  return new Promise((resolve, reject) => {
    const data = {
      copy_id: copyId,
      copy_data: copyData,
      rating,
      is_update_date: isUpdateDate,
    };
    const params = { customer_id: customerId, team_id: teamId };
    authRequest({
      url: `${baseUrl}/edit`,
      method: "post",
      data,
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
}

export const deleteCopy = ({
  id,
  customerId,
  teamId,
}: {
  id: string;
  customerId: string | string[];
  teamId: string | string[];
}): Promise<Copy> => {
  return new Promise((resolve, reject) => {
    const params = {
      copy_id: id,
      customer_id: customerId,
      team_id: teamId,
    };
    authRequest({
      url: `${baseUrl}/delete`,
      method: "delete",
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
