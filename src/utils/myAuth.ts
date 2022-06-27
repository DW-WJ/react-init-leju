import type { TUserInfo } from '@/pages/Login/model';
const TOKEN_KEY = 'REACT_DEMO_TOKEN';
const USER_KEY = 'REACT_USERINFO';
export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token == null || token === 'undefined') {
    return null;
  }
  return token as string;
}
export function removeToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
// 定义userinfo
export function saveUserInfo(userinfo: TUserInfo) {
  var userinfoStr: string = JSON.stringify(userinfo);
  window.localStorage.setItem(USER_KEY, userinfoStr);
}
export function getUserInfo() {
  const userInfo = window.localStorage.getItem(USER_KEY);
  if (userInfo == null || userInfo === 'undefined') {
    return null;
  }
  const userInfoObj: TUserInfo = JSON.parse(userInfo);
  return userInfoObj;
}
export function removeUserInfo() {
  window.localStorage.removeItem(USER_KEY);
}
export function clearUserCache() {
  removeToken();
  removeUserInfo();
}
