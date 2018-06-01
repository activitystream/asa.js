/**
 * @module session
 */

import * as user from "./user";
import { hex_sha1, uid } from "./sha1";
import Baker from "./baker";
import { Campaign } from "./campaign";
import { getDomain } from "./user";

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

const SESSION_EXPIRE_TIMEOUT = 30 * 60 * 1000;
const SESSION_COOKIE_NAME = "__asa_session";

export interface Data {
  campaign?: Campaign;
  referrer?: string;
  [k: string]: any;
}

export interface Session extends Data {
  id: string;
  t: Date;
}

export interface SessionManager {
  hasSession(): boolean;
  createSession(data?: Data): void;
  destroySession(): void;
  getSession(): Session;
  updateTimeout(): void;
}

export class SessionManager implements SessionManager {
  hasSession() {
    const item: string = sessionStore.getItem(SESSION_COOKIE_NAME);
    try {
      return !!(item && JSON.parse(item).t > new Date());
    } catch (e) {
      return false;
    }
  }

  createSession(data: Data): void {
    sessionStore.setItem(
      SESSION_COOKIE_NAME,
      JSON.stringify({
        ...data,
        id: `${getDomain()}.${hex_sha1(`${user.getUser()}.${uid()}`)}`,
        t: new Date().getTime() + SESSION_EXPIRE_TIMEOUT
      })
    );
  }

  destroySession() {
    return sessionStore.removeItem(SESSION_COOKIE_NAME);
  }

  getSession(): Session {
    return JSON.parse(sessionStore.getItem(SESSION_COOKIE_NAME));
  }

  updateTimeout(
    { campaign, referrer, ...sessionData }: Data = this.getSession()
  ) {
    const session: Session = Object.assign(
      {},
      this.getSession(),
      sessionData,
      campaign && { campaign: campaign },
      referrer && { referrer: referrer },
      { t: new Date().getTime() + SESSION_EXPIRE_TIMEOUT }
    );

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

const proxy: SessionManager = {
  getSession: (): Session => sessionManager.getSession(),
  createSession: (data?: Data) => sessionManager.createSession(data),
  hasSession: () => sessionManager.hasSession(),
  updateTimeout: (data?: Data) => sessionManager.updateTimeout(data),
  destroySession: () => sessionManager.destroySession()
};

export default proxy;
