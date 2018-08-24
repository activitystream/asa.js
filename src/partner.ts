/**
 * @module partner
 */

import { window, document } from "./browser";
import { UTM } from "./campaign";

const KEY = {
  PARTNER_ID_KEY: "__as.partner_id",
  PARTNER_SID_KEY: "__as.partner_sid"
};

export const key = (name: string, value?: string): string => {
  if (value) {
    KEY[name] = value;
    updatePartnerInfo();
  }
  return KEY[name];
};

const updatePartnerInfo = () => {
  const uri: URL = document.location && new URL(document.location);
  let partnerId: string = uri.searchParams.get(key("PARTNER_ID_KEY"));
  let partnerSId: string = uri.searchParams.get(key("PARTNER_SID_KEY"));

  UTM.forEach((key: string) => {
    const keyValue: string = decodeURIComponent(
      uri.searchParams.get(key) || ""
    );
    if (keyValue) {
      window.sessionStorage.setItem(`__as.${key}`, keyValue);
    } else {
      window.sessionStorage.removeItem(`__as.${key}`);
    }
  });

  if (partnerId) {
    window.sessionStorage.setItem(key("PARTNER_ID_KEY"), partnerId);
  } else {
    window.sessionStorage.removeItem(key("PARTNER_ID_KEY"));
  }
  if (partnerSId) {
    window.sessionStorage.setItem(key("PARTNER_SID_KEY"), partnerSId);
  } else {
    window.sessionStorage.removeItem(key("PARTNER_SID_KEY"));
  }
};

export const setPartnerInfo = () => {
  const referrer: string = document.referrer && new URL(document.referrer).host;
  const currentHost: string =
    document.location && new URL(document.location).host;
  if (referrer && referrer !== currentHost) {
    updatePartnerInfo();
  }
};

export const getID = (): string =>
  window.sessionStorage.getItem(key("PARTNER_ID_KEY"));
export const getSID = (): string =>
  window.sessionStorage.getItem(key("PARTNER_SID_KEY"));
