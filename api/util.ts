import authRequest from "../utils/authRequest";
import request from "../utils/request";

const baseUrl = "/util";

export const downloadDocx = ({ content }: { content: string }) => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/download-docx`,
      method: "post",
      headers: { "content-type": "application/json" },
      responseType: "blob",
      data: { content },
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

export const downloadBiosynthProductDescription = () => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/download-biosynth-product-description`,
      headers: { "content-type": "application/json" },
      responseType: "blob",
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

export function getIpLookup() {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEO_KEY}`,
      method: "get",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
