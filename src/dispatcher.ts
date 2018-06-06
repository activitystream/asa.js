/**
 * @module dispatcher
 */

import getCampaign, { Campaign } from "./campaign";
import {
  customSession,
  destroySession,
  hasSession,
  createSession,
  refreshSession
} from "./session";
import * as microdata from "./microdata";
import { track } from "./tracking";
import logger from "./logger";
import { web, as, Type } from "./event";
import { document } from "./browser";
import api from "./api";
import dispatcher from "./dispatcher";

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
  let tenant: string = null;
  let providers: string[] = [];

  return function Dispatcher(name?: Type, ...data: any[]) {
    const local: {
      [name: string]: (...data: any[]) => void;
    } = {
      "create.custom.session": customSession,
      "set.tenant.id": (tenant: string) => {
        if (!hasSession()) {
          const referrer: string =
            document.referrer && new URL(document.referrer).host;
          const location: string =
            document.location && new URL(document.location.toString()).host;

          logger.log("no session, starting a new one");
          createSession({
            tenant,
            campaign: getCampaign(),
            referrer:
              referrer &&
              location &&
              referrer !== location &&
              !~providers.indexOf(referrer)
                ? referrer
                : null
          });
          api.submitEvent(new as.web.session.started());
        } else {
          refreshSession({
            tenant,
            campaign: getCampaign()
          });
          api.submitEvent(new as.web.session.resumed());
          logger.log("session resumed");
        }
      },
      "set.connected.partners": (partners: string[]) => track(tenant, partners),
      "set.service.providers": (domains: string[]) => (providers = domains),
      "set.logger.mode": logger.mode,
      "set.metadata.transformer": microdata.setMapper
    };

    try {
      if (!web[name]) {
        if (local[name]) {
          local[name].call(this, ...data);
        }
        return;
      }

      api.submitEvent(new web[name](...data));
    } catch (error) {
      logger.force("inbox exception:", error);
      api.submitError(error, {
        location: "processing inbox message",
        arguments: [event, ...data]
      });
    }
  } as any;
}

export default (window.asa = new Dispatcher());
