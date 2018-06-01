/**
 * @module dispatcher
 */

import getCampaign, { Campaign } from "./campaign";
import session, { customSession } from "./session";
import * as microdata from "./microdata";
import { track } from "./tracking";
import logger from "./logger";
import { web, Type } from "./event";
import { document } from "./browser";
import api from "./api";

declare global {
  interface Window {
    asa: Dispatcher;
  }
}

export interface Dispatcher {
  (name?: Type, ...data: any[]): Dispatcher;

  id?: string;
  setTenant(tenant: string);
  getTenant(): string;
  providers?: string[];
  setProviders(providers: string[]): void;
  getProviders(): string[];
}

export function Dispatcher(tenant?: string): void {
  session.destroySession();
  this.setTenant(tenant);
  this.setProviders([]);

  return function Dispatcher(name?: Type, ...data: any[]): Dispatcher {
    const getReferrer = (): string => {
      const referrer: string =
        document.referrer && new URL(document.referrer).host;
      const location: string =
        document.location && new URL(document.location).host;

      return referrer &&
        location &&
        referrer !== location &&
        !~this.providers.indexOf(referrer)
        ? referrer
        : null;
    };

    try {
      if (!web[name]) {
        if (local[name]) {
          local[name].call(this, ...data);
        }
        return this;
      }
      const campaign: Campaign = getCampaign();
      const referrer: string = getReferrer();
      if (!session.hasSession()) {
        logger.log("no session, starting a new one");
        session.createSession({
          campaign,
          referrer
        });
      } else if (referrer) {
        session.updateTimeout({
          campaign,
          referrer
        });
        logger.log("session resumed");
      }

      api.submitEvent(new web[name](...data));
    } catch (error) {
      logger.force("inbox exception:", error);
      api.submitError(error, {
        location: "processing inbox message",
        arguments: [event, ...data]
      });
    }

    return this;
  }.bind(this);
}

Dispatcher.prototype = new class Dispatcher {
  id: string;
  providers: string[];

  setTenant(tenant: string) {
    this.id = tenant;
  }

  setProviders(providers: string[]) {
    this.providers = providers.map(
      (provider: string): string => new URL(provider).host
    );
  }
}();

const dispatcher: Dispatcher = (window.asa = new Dispatcher());

export const local: {
  [name: string]: (...data: any[]) => void;
} = {
  "custom.session.created": customSession,
  "connected.partners.provided": (partners: string[]): void =>
    track(dispatcher().id, partners),
  "service.providers.provided": Dispatcher.prototype.setProviders,
  "tenant.id.provided": Dispatcher.prototype.setTenant,
  "debug.mode.enabled": logger.mode,
  "metadata.transformer.provided": microdata.setMapper
};

export default dispatcher;
