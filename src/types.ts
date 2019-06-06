import { ASA_REFERRER_KEY } from "./constants";
import { PARTNER_ID_KEY, PARTNER_SID_KEY } from "./partner";

export interface ASAParams extends UTM_KEYS {
  [ASA_REFERRER_KEY]: string;
  [PARTNER_ID_KEY]: string;
  [PARTNER_SID_KEY]: string;
}

export interface UTM_KEYS {
  utm_campaign: string;
  utm_medium: string;
  utm_source: string;
  utm_content: string;
  utm_term: string;
}
