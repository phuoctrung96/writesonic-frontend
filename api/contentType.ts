import authRequest from "../utils/authRequest";
import { Category } from "./category";

const baseUrl = "content-type";

export interface localeContent {
  de: string;
  en: string;
  es: string;
  fr: string;
  it: string;
  pl: string;
  "pt-pt": string;
  ru: string;
}

export interface ContentType {
  id: string;
  content_name: string;
  category_id: number;
  order: number;
  badge: {
    id: number;
    name: string;
    text_color: string;
    background_color: string;
  };
  title: localeContent;
  description: localeContent;
  charge_credits: number;
  num_copies: number;
  color: string;
  image_src: string;
  is_visible: true;
  category?: Category;
  content_type_group_id?: string;
}

export interface ContentTypeGrouped extends ContentType {
  content_types: ContentType[];
}

export const getContentTypeInfo = (id: string): Promise<ContentType[]> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/get-info/${id}`,
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
