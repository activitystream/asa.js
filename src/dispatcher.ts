/**
 * @module dispatcher
 */

import {
  customSession,
  hasSession,
  createSession,
  refreshSession
} from "./session";
import * as microdata from "./microdata";
import { track } from "./tracking";
import logger from "./logger";
import { web, Type, webEvent } from "./event";
import { document } from "./browser";
import { key } from "./partner";
import api from "./api";
import dispatcher from "./dispatcher";
import { setUTMAliases } from "./campaign";

declare global {
  interface Window {
    asa: Dispatcher;
  }
}

export interface Dispatcher {
  id: string;

  (name?: Type, ...data: any[]): Dispatcher;

  setTenant(tenant: string): void;
  getTenant(): string;
  setProviders(providers: string[]): void;
  getProviders(): string[];
}

export function Dispatcher(): void {
  let tenant: string | null = null;
  let providers: string[] = [];

  return function Dispatcher(name: string, ...data: any[]) {
    const setTenantId = (id: string) => {
      tenant = id;
      if (!hasSession()) {
        const referrer: string =
          document.referrer && new URL(document.referrer).host;
        const location: string =
          document.location && new URL(document.location.toString()).host;

        logger.log("no session, starting a new one");
        createSession({
          tenant,
          referrer:
            referrer &&
            location &&
            referrer !== location &&
            !~providers.indexOf(referrer)
              ? referrer
              : null
        });
        api.submitEvent(webEvent("as.web.session.started"));
      } else {
        refreshSession({ tenant });
        api.submitEvent(webEvent("as.web.session.resumed"));
        logger.log("session resumed");
      }
    };

    const local: {
      [name: string]: (...data: any[]) => void;
    } = {
      "create.custom.session": customSession,
      "set.tenant.id": setTenantId,
      "tenant.id.provided": setTenantId,
      "set.connected.partners": (partners: string[]) =>
        track(tenant || "", partners),
      "set.service.providers": (domains: string[]) => (providers = domains),
      "set.partner.key": (name: string, value: string) => key(name, value),
      "set.logger.mode": logger.mode,
      "set.metadata.transformer": microdata.setMapper,
      "set.utm.aliases": aliases => {
        setUTMAliases(aliases);
        refreshSession();
      }
    };

    try {
      if (!web[name]) {
        if (local[name]) {
          local[name](...data);
        }
        return;
      }

      api.submitEvent(web[name](...data));
    } catch (error) {
      logger.force("inbox exception:", error);
      api.submitError(error, {
        location: "processing inbox message",
        arguments: [event, ...data]
      });
    }
  } as any;
}

export default new Dispatcher();
