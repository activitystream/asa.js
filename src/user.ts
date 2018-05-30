/**
 * @module user
 */

import { hex_sha1, uid } from "./sha1";
import * as browser from "./browser";
import Baker from "./baker";

const USER_ID_COOKIE = "__as_user";

let isNew = false;

const generateUser = () => `${getDomain()}.${hex_sha1(uid())}`;

export const clearUser = () => Baker.removeItem(USER_ID_COOKIE);
export const setUser = () => {
  const id = generateUser();
  Baker.setItem(USER_ID_COOKIE, id, Infinity, "/");
  isNew = true;
  return id;
};

export const getUser = () => {
  let user = Baker.getItem(USER_ID_COOKIE);

  // migrations
  if (!user || user.length > 70 || user.length < 40) {
    user = setUser();
  }

  return user;
};

export const getDomain = () => hex_sha1(browser.window.location.host);

export const getHash = (): string => getUser().split(".")[1];

export const isUserNew = () => isNew;
