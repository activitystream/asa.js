/**
 * @module session
 */

import { hex_sha1, uid } from "./sha1";
import getCampaign, { Campaign } from "./campaign";
import { UserManager } from "./user";

const SESSION_EXPIRE_TIMEOUT = 30 * 60 * 1000;
const SESSION_COOKIE_NAME = "__asa_session";

export interface SessionAttrs {
  location: URL;
  referrer?: URL;
  storage: Storage;
  isPartner: boolean;
  user: UserManager;
  tenant: string;
  data?: { [key: string]: string | undefined };
}

export interface Session {
  id: string;
  tenant: string;
  campaign?: Campaign;
  referrer?: URL;
  t: number;
  data?: { [key: string]: string | undefined };
}

export interface SessionManager {
  hasSession(): boolean;
  createSession(data: SessionAttrs): void;
  destroySession(): void;
  getSession(): Session;
  refreshSession(data: SessionAttrs): void;
}

export const createSessionManager = (attrs: SessionAttrs): SessionManager => {
  const { storage, user, location } = attrs;

  return {
    hasSession,
    getSession,
    createSession,
    destroySession,
    refreshSession
  };

  function getSession(): Session {
    let session: Session;
    try {
      session = JSON.parse((storage.getItem(
        SESSION_COOKIE_NAME
      ) as any) as string);
    } catch (e) {
      session = {
        id: "",
        tenant: "",
        t: 0
      };
    }

    session.referrer = session.referrer && new URL(session.referrer.toString());

    return session;
  }

  function createSession(data: SessionAttrs & { [key: string]: string }) {
    const campaign = getCampaign(attrs);
    storage.setItem(
      SESSION_COOKIE_NAME,
      JSON.stringify({
        ...data,
        ...{ campaign },
        storage: undefined,
        id: `${hex_sha1(location.host)}.${hex_sha1(
          `${user.getUser()}.${uid()}`
        )}`,
        t: Date.now() + SESSION_EXPIRE_TIMEOUT
      })
    );
  }

  function destroySession() {
    storage.removeItem(SESSION_COOKIE_NAME);
  }

  function refreshSession(data: SessionAttrs) {
    const campaign: Campaign = getCampaign(data);
    const oldSession = getSession();
    const session: Session = {
      ...oldSession,
      ...(Object.keys(campaign).length && { campaign }),
      ...data,
      // @ts-ignore
      storage: undefined,
      data: { ...(oldSession.data || {}), ...(data.data || {}) },
      t: Date.now() + SESSION_EXPIRE_TIMEOUT
    };

    storage.setItem(SESSION_COOKIE_NAME, JSON.stringify(session));
  }
  function hasSession() {
    try {
      return !!(getSession().t > Date.now());
    } catch (e) {
      return false;
    }
  }
};
