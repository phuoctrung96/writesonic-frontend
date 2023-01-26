import authRequest from "../../utils/authRequest";
import { Category } from "../category";
import { ContentTypeGrouped, localeContent } from "../contentType";

const baseUrl = "/admin/content-type-group";

export interface ContentTypeGroup {
  id: string;
  order: number;
  badge_id: number;
  image_src: string;
  is_visible: boolean;
  title: localeContent;
  description: localeContent;
  content_types: ContentTypeGrouped[];
  content_category: Category;
}

export const getAllContentTypeGroups = (): Promise<ContentTypeGroup[]> => {
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
export const getContentTypeGroup = (params: {
  id: string;
}): Promise<ContentTypeGroup> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/get`,
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

export const createContentTypeGroup = (data: {
  title: string;
  description: string;
  image_src: string;
  content_type_ids: string[];
  category_id: number | string;
}): Promise<ContentTypeGroup> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/create`,
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

export const removeContentTypeGroup = (params: {
  id: string;
}): Promise<ContentTypeGroup> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/remove`,
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

export const updateContentTypeGroup = (data: {
  id: string;
  title: string;
  description: string;
  image_src: string;
  content_type_ids: string[];
  category_id: number | string;
}): Promise<ContentTypeGroup> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update`,
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
