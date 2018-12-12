/**
 * @module campaign
 */

import { window, document } from "./browser";

export const UTM = {
  utm_campaign: ["utm_campaign"],
  utm_medium: ["utm_medium"],
  utm_source: ["utm_source"],
  utm_content: ["utm_content"],
  utm_term: ["utm_term"]
};

export interface Campaign {
  campaign?: string;
  medium?: string;
  source?: string;
  content?: string;
  term?: string;
}

export default (): Campaign => {
  const referrer: URL | undefined =
    document.referrer && new URL(document.referrer);
  const location: URL | undefined =
    document.location && new URL(document.location);

  const campaign: Campaign = {};
  mapUTM((key, value) => {
    const val = value
      .map(
        key =>
          (referrer && referrer.searchParams.get(key)) ||
          (location && location.searchParams.get(key)) ||
          window.sessionStorage.getItem(`__as.${key}`)
      )
      .find(Boolean);
    if (val) campaign[key.substr(4)] = val;
  });

  return campaign;
};

export const mapUTM = <T>(fn: (key: string, value: string[]) => T) =>
  Object.keys(UTM).map(key => fn(key, UTM[key]));

export const setUTMAliases = (aliases: Partial<typeof UTM>) => {
  Object.keys(aliases).forEach(key => {
    UTM[key] = UTM[key].concat(aliases[key]);
  });
};
