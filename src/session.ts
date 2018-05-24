import * as user from "./user";
import { getNumber } from "./randomness";
import { hash } from "./domain_hash";
import Baker from "./baker";

const persistence = {
  get(id) {
    try {
      return Baker.getItem(id);
    } catch (e) {
      throw new Error(
        `Error while trying to get item from session cookie:${id}`
      );
    }
  },
  set(id, value) {
    try {
      return Baker.setItem(id, value, Infinity, "/");
    } catch (e) {
      throw new Error(
        `Error while trying to set item to session cookie: "${id}" <- ${value}`
      );
    }
  },
  remove: id => {
    try {
      Baker.removeItem(id);
    } catch (e) {
      throw new Error(
        `Error while trying to remove item from session cookie: "${id}`
      );
    }
  }
};

const store = {
  hasItem: persistence.get,
  getItem: persistence.get,
  setItem: persistence.set,
  removeItem: persistence.remove
};

const sessionStore = store;

const SESSION_EXPIRE_TIMEOUT = 30 * 60 * 1000;
const SESSION_COOKIE_NAME = "__asa_session";

const builtinSessionManager = {
  hasSession() {
    const item = sessionStore.getItem(SESSION_COOKIE_NAME);
    try {
      return item && JSON.parse(item).t > new Date();
    } catch (e) {
      return false;
    }
  },

  createSession(sessionData) {
    sessionStore.setItem(
      SESSION_COOKIE_NAME,
      JSON.stringify({
        ...sessionData,
        id: `${user.getDomain()}.${hash(`${user.getUser()}.${getNumber()}`)}`,
        t: new Date().getTime() + SESSION_EXPIRE_TIMEOUT
      })
    );
  },

  destroySession: () => sessionStore.removeItem(SESSION_COOKIE_NAME),

  getSession() {
    return JSON.parse(sessionStore.getItem(SESSION_COOKIE_NAME));
  },

  updateTimeout: function updateTimeout(sessionData) {
    const session = {
      ...this.getSession(),
      ...sessionData,
      t: new Date().getTime() + SESSION_EXPIRE_TIMEOUT
    };

    sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(session));
  }
};
const providedSessionManager = (
  hasSession,
  getSession,
  createSession,
  destroySession,
  updateTimeout
) => ({
  hasSession,
  createSession,
  getSession,
  destroySession,
  updateTimeout
});
let sessionManager = builtinSessionManager;
export const getSession = () => sessionManager.getSession();
export const hasSession = () => !!sessionManager.hasSession();
export const createSession = (sessionData?) =>
  sessionManager.createSession(sessionData);
export const destroySession = () => sessionManager.destroySession();
export const customSession = (hasSessions, getSession, createSession) =>
  (sessionManager = providedSessionManager(
    hasSessions,
    getSession,
    createSession,
    destroySession,
    updateTimeout
  ));
export const resetSessionMgmt = () => {
  sessionManager = builtinSessionManager;
};
export const updateTimeout = (sessionData?) =>
  sessionManager.updateTimeout(sessionData);
