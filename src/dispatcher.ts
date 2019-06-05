/**
 * @module dispatcher
 */

import { createSessionManager, SessionManager } from "./session";
import * as microdata from "./microdata";
import { track } from "./tracking";
import logger from "./logger";
import { web, EventType, webEvent, Product, Order, EventAttrs } from "./event";
import {
  KEY,
  setPartnerInfo,
  PARTNER_ID_KEY,
  PARTNER_SID_KEY
} from "./partner";
import api from "./api";
import { setUTMAliases, UTM } from "./campaign";
import { createUserManager } from "./user";
import { ASA_REFERRER_KEY } from "./constants";
import { ASAParams } from "./types";

export interface Dispatcher {
  (type: "set.session.events.enabled", enabled: boolean): void;
  (type: "create.custom.session", sessionManager: SessionManager): void;
  (type: "set.tenant.id", id: string): void;
  (type: "tenant.id.provided", id: string): void;
  (type: "set.connected.partners", partners: string[]): void;
  (type: "set.service.providers", domains: string[]): void;
  (type: "set.partner.key", name: string, value: string): void;
  (type: "set.logger.mode", mode: boolean): void;
  (type: "set.metadata.transformer", mapper: any): void;
  (type: "set.utm.aliases", aliases: Partial<typeof UTM>): void;
  (type: "as.web.product.viewed", product: Array<string | Product>): void;
  (type: "as.web.payment.completed", order: Array<string | Order>): void;
}

export interface DispatcherAttrs {
  location: URL;
  referrer?: URL | undefined;
  storage: Storage;
  title: string;
  pixelMetadata?: { originalUrl: string };
}

export function Dispatcher(attrs: DispatcherAttrs): Dispatcher {
  let tenant: string = "";
  let providers: string[] = [];
  let sessionEvents = true;
  const isPartner = (host: string) => providers.indexOf(host) > -1;

  const user = createUserManager(attrs);

  let sessionManager = createSessionManager({
    ...attrs,
    user,
    tenant: "",
    isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
  });

  const eventAttrs: EventAttrs = {
    ...attrs,
    user,
    session: sessionManager
  };

  try {
    eventAttrs.meta = microdata.extractFromHead();
  } catch (e) {
    // swallow error, since this will fail on the server
  }

  const setTenantId = (id: string) => {
    tenant = id;
    if (!sessionManager.hasSession()) {
      logger.log("no session, starting a new one");
      sessionManager.createSession({
        ...attrs,
        tenant,
        user,
        isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
      });
      if (sessionEvents) {
        api.submitEvent(webEvent(eventAttrs, "as.web.session.started"));
      }
    } else {
      sessionManager.refreshSession({
        ...attrs,
        tenant,
        user,
        isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
      });
      if (sessionEvents) {
        api.submitEvent(webEvent(eventAttrs, "as.web.session.resumed"));
      }
      logger.log("session resumed");
    }
  };

  const types = {
    "set.session.events.enabled": (enabled: boolean) =>
      (sessionEvents = enabled),
    "create.custom.session": (_sessionManager: SessionManager) => {
      sessionManager = _sessionManager;
      eventAttrs.session = sessionManager;
    },
    "set.tenant.id": setTenantId,
    "tenant.id.provided": setTenantId,
    "set.connected.partners": (partners: string[]) =>
      track({
        session: sessionManager,
        tenant: tenant || "",
        domains: partners
      }),
    "set.service.providers": (domains: string[]) => (providers = domains),
    "set.partner.key": (name: string, value: string) => {
      KEY[name] = value;
      setPartnerInfo(eventAttrs);
    },
    "set.logger.mode": logger.mode,
    "set.metadata.transformer": microdata.setMapper,
    "set.utm.aliases": (aliases: Partial<typeof UTM>) => {
      setUTMAliases(aliases);
      sessionManager.refreshSession({
        ...attrs,
        tenant,
        user,
        isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
      });
    }
  };

  type Type = keyof typeof types | EventType;

  const Dispatcher = function(type: Type, ...data: any[]) {
    try {
      if (!(type in web)) {
        if (type in types) {
          types[type](...data);
        }
        return;
      }

      api.submitEvent(web[type](eventAttrs, ...data));
    } catch (error) {
      logger.force("inbox exception:", error);
      api.submitError(error, {
        location: "processing inbox message",
        arguments: [event, ...data]
      });
    }
  };

  Dispatcher.getParams = function getParams(): Partial<ASAParams> {
    const currentSession = sessionManager.getSession();
    const campaign = currentSession.campaign || {};
    const referrer = currentSession.referrer;

    const params: Partial<ASAParams> = {};

    Object.keys(campaign).forEach(function(key) {
      params[`utm_${key}`] = campaign[key];
    });

    if (referrer) {
      params[ASA_REFERRER_KEY] = referrer.toString();
    }

    params[PARTNER_ID_KEY] = currentSession.tenant;
    params[PARTNER_SID_KEY] = currentSession.id;

    return params;
  };

  return Dispatcher;
}
