/**
 * @module partner
 */

import { window, document } from "./browser";
import { UTM } from "./campaign";

export const PARTNER_ID_KEY = "__as.partner_id";
export const PARTNER_SID_KEY = "__as.partner_sid";

const updatePartnerInfo = () => {
  const uri = new URL(window.location.href);
  let partnerId = uri.searchParams.get(PARTNER_ID_KEY);
  let partnerSId = uri.searchParams.get(PARTNER_SID_KEY);

  UTM.forEach(key => {
    const keyValue = decodeURIComponent(uri.searchParams.get(key) || "");
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
    document.location && new URL(window.location.href).host;
  if (referrer !== currentHost) {
    updatePartnerInfo();
  }
};

export const getID = () => window.sessionStorage.getItem(PARTNER_ID_KEY);
export const getSID = () => window.sessionStorage.getItem(PARTNER_SID_KEY);
