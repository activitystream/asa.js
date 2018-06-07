/**
 * @module session
 */

import * as user from "./user";
import { hex_sha1, uid } from "./sha1";
import Baker from "./baker";
import getCampaign, { Campaign } from "./campaign";
import { getDomain } from "./user";
import { document } from "./browser";

const SESSION_EXPIRE_TIMEOUT = 30 * 60 * 1000;
const SESSION_COOKIE_NAME = "__asa_session";

const persistence = {
  get(id: string): string {
    try {
      return Baker.getItem(id);
    } catch (e) {
      throw new Error(
        `Error while trying to get item from session cookie:${id}`
      );
    }
  },
  set(id: string, value: string): boolean {
    try {
      return Baker.setItem(id, value, Infinity, "/");
    } catch (e) {
      throw new Error(
        `Error while trying to set item to session cookie: "${id}" <- ${value}`
      );
    }
  },
  remove: (id: string): void => {
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

export interface Data {
  [k: string]: any;
}

export interface Session extends Data {
  id: string;
  tenant: string;
  campaign?: Campaign;
  referrer?: string;
  t: number;
}

export interface SessionManager {
  hasSession(): boolean;
  createSession(data?: Data): void;
  destroySession(): void;
  getSession(): Session;
  refreshSession(): void;
}

export class SessionManager implements SessionManager {
  hasSession() {
    try {
      return !!(getSession().t > Date.now());
    } catch (e) {
      return false;
    }
  }

  createSession(data?: Data): void {
    const campaign: Campaign = getCampaign();
    sessionStore.setItem(
      SESSION_COOKIE_NAME,
      JSON.stringify({
        ...data,
        ...(campaign && { campaign }),
        id: `${getDomain()}.${hex_sha1(`${user.getUser()}.${uid()}`)}`,
        t: Date.now() + SESSION_EXPIRE_TIMEOUT
      })
    );
  }

  destroySession() {
    return sessionStore.removeItem(SESSION_COOKIE_NAME);
  }

  getSession(): Session {
    return JSON.parse(sessionStore.getItem(SESSION_COOKIE_NAME));
  }

  refreshSession(data?: Data) {
    const campaign: Campaign = getCampaign();
    const session: Session = {
      ...this.getSession(),
      ...(campaign && { campaign }),
      ...data,
      t: Date.now() + SESSION_EXPIRE_TIMEOUT
    };

    sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(session));
  }
}
let sessionManager: SessionManager = new SessionManager();
export const customSession = (
  hasSession: () => boolean,
  getSession: () => Session,
  createSession: (data: Data) => void
): void => {
  sessionManager = new class extends SessionManager {
    hasSession() {
      return hasSession();
    }
    getSession() {
      return getSession();
    }
    createSession(data: Data) {
      createSession(data);
    }
  }();
};
export const resetManager = () => {
  sessionManager = new SessionManager();
};

export const getSession = (): Session => sessionManager.getSession();
export const createSession = (data?: Data) =>
  sessionManager.createSession(data);
export const hasSession = () => sessionManager.hasSession();
export const refreshSession = (data?: Data) =>
  sessionManager.refreshSession(data);
export const destroySession = () => sessionManager.destroySession();
