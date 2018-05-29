import * as microdata from "./microdata";
import session, { customSession, Session } from "./session";
import * as autoTrack from "./auto_track";
import * as info from "./version";
import * as user from "./user";
import { window } from "./browser";
import inbox from "./inbox";
import parser from "./parseuri";
import * as debug from "./debug";
import * as partner from "./partner";
import { Campaign } from "./campaign";

const DOMMeta = (selector: HTMLElement | HTMLElement[] | string) =>
  selector &&
  (selector instanceof HTMLElement ||
    selector[0] instanceof HTMLElement ||
    typeof selector === "string")
    ? selector
    : false;

export namespace AsaEvent {
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
    meta: any;
    v: string;
    [data: string]: any;
  }

  export class Event {
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
      if (inbox.id) this.tenant = inbox.id;

      if (partner_id) this.partner_id = partner_id;
      if (partner_sid) this.partner_sid = partner_sid;
      this.v = info.version();
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
        constructor(data) {
          super();
          if (DOMMeta(data)) {
            const meta = microdata.extract(data);
            if (meta) this.meta = meta;
          } else {
            this.meta = { ...data, ...microdata.extractFromHead() };
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

  export const local: {
    [name: string]: (...data: any[]) => void;
  } = {
    "custom.session.created": customSession,
    "connected.partners.provided": function(domains: string[]) {
      autoTrack.links(domains);
    },
    "service.providers.provided": function(providers: string[]) {
      this.providers = providers.map(parser.getAuthority.bind(parser));
    },
    "tenant.id.provided": function(id: string) {
      this.id = id;
    },
    "debug.mode.enabled": function(on: boolean) {
      debug.setDebugMode(on);
    },
    "microdata.transformer.provided": function(mapper: () => any) {
      microdata.setMapper(mapper);
    }
  };
  export type Type = keyof typeof web | keyof typeof local;
}
