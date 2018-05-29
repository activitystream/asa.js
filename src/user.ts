import { hash } from "./domain_hash";
import { getNumber } from "./randomness";
import * as browser from "./browser";
import Baker from "./baker";

const USER_ID_COOKIE = "__as_user";

let isNew = false;

const generateUser = () =>
  `${hash(browser.window.location.host)}.${hash(`${getNumber()}`)}`;

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

export const getDomain = () => hash(browser.window.location.host);

export const getHash = () => hash(getUser().split(".")[1]);

export const isUserNew = () => isNew;
