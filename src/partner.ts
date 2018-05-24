import parser from "./parseuri";
import { window, document } from "./browser";
import { UTM } from "./campaign";

const PARTNER_ID_KEY = "__as.PARTNER_ID";
const PARTNER_SID_KEY = "__as.PARTNER_SID";

const updatePartnerInfo = () => {
  const asaPartnerKey = "__asa";

  const uri = parser.parseURI(window.location.href);
  const asaPartnerValue = decodeURIComponent(uri.queryKey.__asa || "").split(
    "|"
  );
  let partnerId;
  let partnerSId;
  if (asaPartnerValue) {
    partnerId = asaPartnerValue[0];
    partnerSId = asaPartnerValue[1];
  }

  UTM.forEach(key => {
    const keyValue = decodeURIComponent(uri.queryKey[key] || "");
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
  const referrer = parser.parseURI(document.referrer).authority;
  const currentHost = parser.parseURI(window.location.origin).authority;
  if (referrer !== currentHost) {
    updatePartnerInfo();
  }
};

export const getID = () => window.sessionStorage.getItem(PARTNER_ID_KEY);
export const getSID = () => window.sessionStorage.getItem(PARTNER_SID_KEY);