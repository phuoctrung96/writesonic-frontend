import Cookies from "js-cookie";
const TokenKey: string = "Token";
const isLoggedIn: string = "isLoggedIn";
export function getToken(): string {
  return Cookies.get(TokenKey);
}

export function setToken(token: string): string {
  Cookies.set(isLoggedIn, "true", { domain: "writesonic.com" });
  return Cookies.set(TokenKey, token);
}
export function clearAllCookie() {
  Cookies.set(isLoggedIn, "false", { domain: "writesonic.com" });
  Cookies.remove(TokenKey);
}
