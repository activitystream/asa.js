/**
 * @module event
 */

import * as microdata from "./microdata";
import session, { Session } from "./session";
import { version } from "../package.json";
import * as user from "./user";
import { window } from "./browser";
import dispatcher from "./dispatcher";
import * as partner from "./partner";
import { Campaign } from "./campaign";

const DOMMeta = (selector: HTMLElement | HTMLElement[] | string) =>
  selector &&
  (selector instanceof HTMLElement ||
    selector[0] instanceof HTMLElement ||
    typeof selector === "string")
    ? selector
    : false;

export interface Event {
  type: Type;
  origin: string;
  occurred: Date;
  campaign?: Campaign;
  tenant?: string;
  user: {
    did: string;
    sid: string;
  };
  page: {
    url?: string;
    referrer?: string;
  };
  partner_id: string;
  partner_sid: string;
  meta?: { [key: string]: any };
  v: string;
  [data: string]: any;
}

export abstract class Event {
  constructor() {
    const { id, referrer, campaign }: Session = session.getSession();
    const partner_id: string = partner.getID();
    const partner_sid: string = partner.getSID();

    this.origin = window.location.origin;
    this.occurred = new Date();
    if (campaign) this.campaign = campaign;
    this.user = {
      did: user.getUser(),
      sid: id
    };

    this.page = {
      url: window.location.href
    };
    if (referrer) this.page.referrer = referrer;
    if (dispatcher().id) this.tenant = dispatcher().id;

    if (partner_id) this.partner_id = partner_id;
    if (partner_sid) this.partner_sid = partner_sid;
    this.v = version;
  }

  toJSON(): string {
    return JSON.parse(JSON.stringify(Object.assign({}, this)));
  }

  [Symbol.toPrimitive](): string {
    return this.type;
  }
}

export namespace as.web {
  export namespace order {
    export class reviewed extends Event {
      type = "as.web.order.reviewed";
    }
  }
  export namespace customer.account {
    export class provided extends Event {
      type = "as.web.customer.account.provided";
    }
  }
  export namespace product {
    export class product extends Event {
      constructor(...data: any[]) {
        super();
        if (DOMMeta(data[0])) {
          let meta = microdata.extract(data[0]);
          if (meta && data[1]) meta = { ...meta, ...data[1] };
          if (meta) this.meta = meta;
        } else {
          this.meta = { ...data[0], ...microdata.extractFromHead() };
        }
      }
    }
    export namespace availability {
      export class checked extends product {
        type = "as.web.product.availability.checked";
      }
    }
    export class carted extends product {
      type = "as.web.product.carted";
    }
    export class searched extends product {
      type = "as.web.product.searched";
    }
    export namespace shipping {
      export class selected extends product {
        type = "as.web.product.shipping.selected";
      }
    }
    export class viewed extends product {
      type = "as.web.product.viewed";
    }
  }
  export namespace payment {
    export class completed extends Event {
      type = "as.web.payment.completed";
    }
  }
}

export const web: {
  [name: string]: new (...args: any[]) => Event;
} = {
  "as.web.customer.account.provided": as.web.customer.account.provided,
  "as.web.order.reviewed": as.web.order.reviewed,
  "as.web.product.availability.checked": as.web.product.availability.checked,
  "as.web.product.carted": as.web.product.carted,
  "as.web.product.searched": as.web.product.searched,
  "as.web.product.shipping.selected": as.web.product.shipping.selected,
  "as.web.product.viewed": as.web.product.viewed,
  "as.web.payment.completed": as.web.payment.completed
};

export type Type = keyof typeof web;
