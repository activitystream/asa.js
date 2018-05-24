import * as microdata from "./microdata";
import { getSession } from "./session";
import * as info from "./version";
import * as user from "./user";
import * as parseUri from "./parseuri";
import { window } from "./browser";
import * as partner from "./partner";

const DOMMeta = selector =>
  selector &&
  (selector instanceof HTMLElement ||
    selector[0] instanceof HTMLElement ||
    typeof selector === "string")
    ? selector
    : false;

export namespace WebEvent {
  export enum Type {
    "session.started" = "session.started",
    "session.resumed" = "session.resumed",
    "as.web.customer.account.provided" = "as.web.customer.account.provided",
    "as.web.order.reviewed" = "as.web.order.reviewed",
    "as.web.product.availability.checked" = "as.web.product.availability.checked",
    "as.web.product.carted" = "as.web.product.carted",
    "as.web.product.searched" = "as.web.product.searched",
    "as.web.product.shipping.selected" = "as.web.product.shipping.selected",
    "as.web.product.viewed" = "as.web.product.viewed",
    "as.web.payment.completed" = "as.web.payment.completed",
    "page.viewed" = "page.viewed",
    "custom" = "custom"
  }

  export interface Event {
    type: Type;
    origin: string;
    occurred: Date;
    campaign: any;
    tenant: string;
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
    location: string;
    meta: any;
    title: string;
    v: string;
    [data: string]: any;
  }

  export class Event {
    constructor(data?: any) {
      const { id, referrer, campaign } = getSession();
      const partner_id = partner.getID();
      const partner_sid = partner.getSID();

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
      if (window.asa.id) this.tenant_id = window.asa.id;

      if (partner_id) this.partner_id = partner_id;
      if (partner_sid) this.partner_sid = partner_sid;
      this.v = info.version();
      Object.assign(this, data);
    }

    toJSON() {
      return JSON.parse(JSON.stringify(Object.assign({}, this)));
    }

    [Symbol.toPrimitive]() {
      return this.type;
    }
  }

  export namespace page {
    export class viewed extends Event {
      type = Type["page.viewed"];
      location: string = window.location.href;
      title: string = document.title;

      constructor(...args: any[]) {
        super();
        if (DOMMeta(args[0])) {
          const meta = microdata.extract(args[0]);
          if (meta) this.meta = meta;
          if (args[1]) this.meta = { ...this.meta, ...args[1] };
        } else if (args[0]) {
          this.meta = {
            ...this.meta,
            ...args[0],
            ...microdata.extractFromHead()
          };
        } else {
          this.meta = microdata.extractFromHead();
        }
      }
    }
  }

  export namespace session {
    export class started extends page.viewed {
      type = Type["session.started"];
      meta = { ...this.meta, ...microdata.extractFromHead() };
    }
    export class resumed extends Event {
      type = Type["session.resumed"];
      meta = { ...this.meta, ...microdata.extractFromHead() };
    }
  }

  export namespace as.web {
    export namespace order {
      export class reviewed extends Event {
        type = Type["as.web.order.reviewed"];
      }
    }
    export namespace product {
      export namespace availability {
        export class checked extends Event {
          type = Type["as.web.product.availability.checked"];
        }
      }
      export class carted extends Event {
        type = Type["as.web.product.carted"];
      }
      export class searched extends Event {
        type = Type["as.web.product.searched"];
      }
      export namespace shipping {
        export class selected extends Event {
          type = Type["as.web.product.shipping.selected"];
        }
      }
      export class viewed extends Event {
        type = Type["as.web.product.viewed"];
      }
    }
    export namespace payment {
      export class completed extends Event {
        type = Type["as.web.payment.completed"];
      }
    }
  }

  export const custom = event =>
    class custom extends Event {
      type = Type["custom"];
      event: any = event;
      constructor(...args: any[]) {
        super();
        if (DOMMeta(args[0])) {
          const meta = microdata.extract(args[0]);
          if (meta) this.meta = meta;
          if (args[1]) this.meta = { ...this.meta, ...args[1] };
        } else if (args[0]) {
          this.meta = {
            ...this.meta,
            ...args[0]
          };
        }
      }
    };
}
