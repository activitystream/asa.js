/**
 * @module partner
 */

import { window, document } from "./browser";
import { UTM } from "./campaign";

export const PARTNER_ID_KEY = "__as.partner_id";
export const PARTNER_SID_KEY = "__as.partner_sid";

const updatePartnerInfo = () => {
  const uri: URL = window.location && new URL(window.location.href);
  let partnerId: string = uri.searchParams.get(PARTNER_ID_KEY);
  let partnerSId: string = uri.searchParams.get(PARTNER_SID_KEY);

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
    window.sessionStorage.setItem(PARTNER_ID_KEY, partnerId);
  } else {
    window.sessionStorage.removeItem(PARTNER_ID_KEY);
  }
  if (partnerSId) {
    window.sessionStorage.setItem(PARTNER_SID_KEY, partnerSId);
  } else {
    window.sessionStorage.removeItem(PARTNER_SID_KEY);
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
  window.sessionStorage.getItem(PARTNER_ID_KEY);
export const getSID = (): string =>
  window.sessionStorage.getItem(PARTNER_SID_KEY);
