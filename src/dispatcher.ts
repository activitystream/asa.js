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
}

export function Dispatcher(name?: Type, ...data: any[]): void {
  const local: {
    [name: string]: (...data: any[]) => void;
  } = {
    "create.custom.session": customSession,
    "set.tenant.id": this.constructor.setTenant,
    "set.connected.partners": track.bind(null, this.constructor.getTenant()),
    "set.logger.mode": logger.mode,
    "set.metadata.transformer": microdata.setMapper
  };

  try {
    if (!web[name]) {
      if (local[name]) {
        local[name](...data);
      }
      return Dispatcher.bind(this);
    }

    api.submitEvent(new web[name](...data));
  } catch (error) {
    logger.force("inbox exception:", error);
    api.submitError(error, {
      location: "processing inbox message",
      arguments: [event, ...data]
    });
  }

  return Dispatcher.bind(this);
}

Dispatcher.prototype = new class Dispatcher {
  static id: string;

  static setTenant(tenant: string): void {
    if (!hasSession()) {
      logger.log("no session, starting a new one");
      createSession();
      api.submitEvent(new as.web.session.started());
    } else {
      refreshSession();
      api.submitEvent(new as.web.session.resumed());
      logger.log("session resumed");
    }
    this.id = tenant;
  }

  static getTenant(): string {
    return this.id;
  }
}();

export default (window.asa = new Dispatcher());
