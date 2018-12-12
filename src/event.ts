/**
 * @module event
 */

import * as microdata from "./microdata";
import { getSession, Session } from "./session";
import { version } from "../package.json";
import * as user from "./user";
import { window } from "./browser";
import * as partner from "./partner";
import { Campaign } from "./campaign";

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
  meta?: { [key: string]: any };
  partner_id: string;
  partner_sid: string;
  v: string;
  [data: string]: any;
}

interface PaymentEvent extends Event {
  orders: string[];
}
interface ProductEvent extends Event {
  products: string[];
}

export const webEvent = (type: string): Event => {
  const { id, referrer, campaign, tenant }: Session = getSession();
  const meta = microdata.extractFromHead();
  const partner_id: string = partner.getID();
  const partner_sid: string = partner.getSID();
  const origin = window.location.origin;
  const occurred = new Date();
  const page = { url: window.location.href, referrer };
  const title = document.title.toString();
  return {
    type,
    partner_id,
    partner_sid,
    origin,
    occurred,
    campaign,
    title,
    user: { did: user.getUser(), sid: id },
    page,
    meta,
    tenant,
    v: version
  };
};

export type Currency = string;
export type Money = number;

export interface Product {
  type?: string;
  id: string;
}

export interface Order {
  type?: string;
  id: string;
}

export enum IDType {
  Email = "Email"
}

export interface ID {
  type: IDType;
  id: string;
}

const paymentEvent = (orders: Array<string | Order>): PaymentEvent => {
  const event = webEvent("as.web.payment.completed") as PaymentEvent;
  event.orders = orders.map(o => {
    if (typeof o === "string") return o;
    if (o.type) return o.type + "/" + o.id;
    return o.id;
  });
  return event;
};

const productEvent = (productids: Array<string | Product>): ProductEvent => {
  const event = webEvent("as.web.product.viewed") as ProductEvent;
  event.products = productids.map(p => {
    if (typeof p === "string") return p;
    if (p.type) return p.type + "/" + p.id;
    return p.id;
  });
  return event;
};

export const web: {
  [name: string]: (...args: any[]) => Event;
} = {
  "as.web.session.started": () => webEvent("as.web.session.started"),
  "as.web.session.resumed": () => webEvent("as.web.session.resumed"),
  "as.web.product.viewed": productEvent,
  "as.web.payment.completed": paymentEvent
};

export type Type = keyof typeof web;
