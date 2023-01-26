import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "./auth";

let cancelTokenSource = axios.CancelToken.source();

export default function authRequest(
  options: AxiosRequestConfig
): Promise<{ data: any }> {
  const token: string = getToken();
  cancelTokenSource = axios.CancelToken.source();
  if (!token) {
    return Promise.reject(new Error("Invalid Token!"));
  }
  const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "access-token": token,
    },
    cancelToken: cancelTokenSource.token,
  });
  return request(options);
}

export function cancelRequest() {
  cancelTokenSource.cancel();
}

export function isCanceled(err) {
  return axios.isCancel(err);
}
