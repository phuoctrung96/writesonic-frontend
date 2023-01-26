import authRequest from "../../utils/authRequest";
import { ContentType, ContentTypeGrouped } from "../contentType";

const baseUrl = "admin/content-type";

export const getAllContentTypes = (): Promise<ContentTypeGrouped[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all`,
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

export const getAllContentTypesByGroupId = (params: {
  id: string;
}): Promise<ContentTypeGrouped[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all-by-group`,
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

export const getAllContentTypesByCategory = (params: {
  content_category_id: string | number;
}): Promise<ContentType[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all-by-category`,
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

export const updateContentTypeOrder = (
  data: { id: string; index: number; is_group: boolean; group_id?: string }[],
  groupId?: string
): Promise<ContentTypeGrouped[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-order`,
      method: "post",
      data,
      params: { group_id: groupId },
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

export const updateContentTypeBadge = (data: {
  id: string;
  badge_id: string | number;
  is_group: boolean;
  group_id?: string;
}): Promise<ContentTypeGrouped[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-badge`,
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

export const updateContentTypeVisible = (data: {
  id: string;
  visible: string | number;
  is_group: boolean;
  group_id?: string;
}): Promise<ContentTypeGrouped[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-visible`,
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
