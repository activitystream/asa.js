/**
 * @module user
 */

import { hex_sha1, uid } from "./sha1";

const USER_ID_COOKIE = "__as_user";
interface UserAttrs {
  storage: Storage;
  location: URL;
}

export interface UserManager {
  getUser(): string;
  setUser(id?: string): string;
  clearUser(): void;
  getHash(): string;
  isUserNew(): boolean;
}

export const createUserManager = ({
  storage,
  location
}: UserAttrs): UserManager => {
  let isNew = false;

  return {
    getUser,
    setUser,
    clearUser,
    getHash,
    isUserNew
  };

  function setUser(id?: string) {
    if (!id) id = generateUser(location.host, uid());
    storage.setItem(USER_ID_COOKIE, id);
    isNew = true;
    return id;
  }
  function clearUser() {
    storage.removeItem(USER_ID_COOKIE);
  }
  function getUser() {
    let user = storage.getItem(USER_ID_COOKIE);
    // migrations
    if (!user || user.length > 70 || user.length < 40) {
      user = setUser();
    }

    return user;
  }

  function getHash() {
    return getUser().split(".")[1];
  }

  function isUserNew() {
    return isNew;
  }
};

const generateUser = (domain: string, id: number) =>
  `${hex_sha1(domain)}.${hex_sha1(id)}`;
