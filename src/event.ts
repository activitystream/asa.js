/**
 * @module event
 */

import { Session, SessionManager } from "./session";
import { version } from "../package.json";
import { UserManager } from "./user";
import * as partner from "./partner";
import { Campaign } from "./campaign";

export interface Event {
  type: EventType;
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

export interface EventAttrs {
  location: URL;
  title: string;
  storage: Storage;
  user: UserManager;
  session: SessionManager;
  meta?: { [key: string]: string };
}

export const webEvent = (
  { location, title, storage, user, session, meta }: EventAttrs,
  type: EventType
): Event => {
  const { id, referrer, campaign, tenant }: Session = session.getSession();
  const partner_id: string = partner.getID(storage);
  const partner_sid: string = partner.getSID(storage);
  const origin = location.origin;
  const occurred = new Date();
  const page = {
    url: location.href,
    referrer: referrer ? referrer.hostname : undefined
  };
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

const paymentEvent = (
  attrs: EventAttrs,
  orders: Array<string | Order>
): PaymentEvent => {
  const event = webEvent(attrs, "as.web.payment.completed") as PaymentEvent;
  event.orders = orders.map(o => {
    if (typeof o === "string") return o;
    if (o.type) return o.type + "/" + o.id;
    return o.id;
  });
  return event;
};

const productEvent = (
  attrs: EventAttrs,
  productids: Array<string | Product>
): ProductEvent => {
  const event = webEvent(attrs, "as.web.product.viewed") as ProductEvent;
  event.products = productids.map(p => {
    if (typeof p === "string") return p;
    if (p.type) return p.type + "/" + p.id;
    return p.id;
  });
  return event;
};

export const web = {
  "as.web.session.started": (attrs: EventAttrs) =>
    webEvent(attrs, "as.web.session.started"),
  "as.web.session.resumed": (attrs: EventAttrs) =>
    webEvent(attrs, "as.web.session.resumed"),
  "as.web.product.viewed": productEvent,
  "as.web.payment.completed": paymentEvent
};

export type EventType = keyof typeof web;
