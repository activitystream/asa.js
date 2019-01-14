/**
 * @module partner
 */

import { mapUTM } from "./campaign";

export const KEY = {
  PARTNER_ID_KEY: "__as.partner_id",
  PARTNER_SID_KEY: "__as.partner_sid"
};

interface PartnerAttrs {
  location: URL;
  referrer?: URL;
  storage: Storage;
}

const updatePartnerInfo = ({ location, storage }: PartnerAttrs) => {
  let partnerId: string = location.searchParams.get(KEY.PARTNER_ID_KEY) || "";
  let partnerSId: string = location.searchParams.get(KEY.PARTNER_SID_KEY) || "";

  mapUTM((key: string, values: string[]) => {
    const keyValue =
      values
        .map(key => decodeURIComponent(location.searchParams.get(key) || ""))
        .find(Boolean) || "";
    if (keyValue) {
      storage.setItem(`__as.${key}`, keyValue);
    } else {
      storage.removeItem(`__as.${key}`);
    }
  });

  if (partnerId) {
    storage.setItem(KEY.PARTNER_ID_KEY, partnerId);
  } else {
    storage.removeItem(KEY.PARTNER_ID_KEY);
  }
  if (partnerSId) {
    storage.setItem(KEY.PARTNER_SID_KEY, partnerSId);
  } else {
    storage.removeItem(KEY.PARTNER_SID_KEY);
  }
};

export const setPartnerInfo = (attrs: PartnerAttrs) => {
  const referrer = attrs.referrer && attrs.referrer.host;
  const currentHost = attrs.location.host;
  if (referrer && referrer !== currentHost) {
    updatePartnerInfo(attrs);
  }
};

export const getID = (storage: Storage): string =>
  storage.getItem(KEY.PARTNER_ID_KEY) || "";
export const getSID = (storage: Storage): string =>
  storage.getItem(KEY.PARTNER_SID_KEY) || "";
