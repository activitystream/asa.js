/**
 * @module dispatcher
 */

import { createSessionManager, SessionManager } from "./session";
import * as microdata from "./microdata";
import { track } from "./tracking";
import logger from "./logger";
import { web, EventType, webEvent, Product, Order, EventAttrs } from "./event";
import { KEY, setPartnerInfo } from "./partner";
import api from "./api";
import { setUTMAliases, UTM } from "./campaign";
import { createUserManager } from "./user";

export interface Dispatcher {
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
}

export function Dispatcher(attrs: DispatcherAttrs): Dispatcher {
  let tenant: string = "";
  let providers: string[] = [];
  const isPartner = (host: string) => providers.indexOf(host) > -1;

  const user = createUserManager(attrs);

  let session = createSessionManager({
    ...attrs,
    user,
    tenant: "",
    isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
  });

  const eventAttrs: EventAttrs = {
    ...attrs,
    user,
    session
  };

  try {
    eventAttrs.meta = microdata.extractFromHead();
  } catch (e) {
    // swallow error, since this will fail on the server
  }

  const setTenantId = (id: string) => {
    tenant = id;
    if (!session.hasSession()) {
      logger.log("no session, starting a new one");
      session.createSession({
        ...attrs,
        tenant,
        user,
        isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
      });
      api.submitEvent(webEvent(eventAttrs, "as.web.session.started"));
    } else {
      session.refreshSession({
        ...attrs,
        tenant,
        user,
        isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
      });
      api.submitEvent(webEvent(eventAttrs, "as.web.session.resumed"));
      logger.log("session resumed");
    }
  };

  const types = {
    "create.custom.session": (sessionManager: SessionManager) => {
      session = sessionManager;
      eventAttrs.session = session;
    },
    "set.tenant.id": setTenantId,
    "tenant.id.provided": setTenantId,
    "set.connected.partners": (partners: string[]) =>
      track({ session, tenant: tenant || "", domains: partners }),
    "set.service.providers": (domains: string[]) => (providers = domains),
    "set.partner.key": (name: string, value: string) => {
      KEY[name] = value;
      setPartnerInfo(eventAttrs);
    },
    "set.logger.mode": logger.mode,
    "set.metadata.transformer": microdata.setMapper,
    "set.utm.aliases": (aliases: Partial<typeof UTM>) => {
      setUTMAliases(aliases);
      session.refreshSession({
        ...attrs,
        tenant,
        user,
        isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
      });
    }
  };

  type Type = keyof typeof types | EventType;

  return function Dispatcher(type: Type, ...data: any[]) {
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
}
