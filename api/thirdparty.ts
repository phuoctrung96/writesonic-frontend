import authRequest from "../utils/authRequest";

const baseUrl = "thirdparty";

export interface WordpressSearchOutput {
  columnNames?: string[];
  rows?: string[][];
}

export const wordpressLogin = (params: { code: string | string[] }) => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/wordpress-login`,
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

export const disconnectWordpress = () => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/disconnect-wordpress`,
      method: "post",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postContentToWordpress = ({
  title,
  content,
  status,
}: {
  title: string;
  content: any;
  status: string;
}) => {
  return new Promise((resolve, reject) => {
    const data = {
      title: title,
      content: content,
      status: status,
    };
    authRequest({
      url: `${baseUrl}/publish-to-wordpress`,
      method: "post",
      data: data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
