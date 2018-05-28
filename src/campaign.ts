import { window, document } from "./browser";

export enum UTM {
  "utm_campaign",
  "utm_medium",
  "utm_source",
  "utm_content",
  "utm_term",
  "length"
}

export namespace UTM {
  export const forEach = Array.prototype.forEach;
  export const map = Array.prototype.map;
}

export class Campaign {
  constructor(
    public campaign?: string,
    public medium?: string,
    public source?: string,
    public content?: string,
    public term?: string
  ) {}
}

export default (): Campaign => {
  const referrer: URL | undefined =
    document.referrer && new URL(document.referrer);
  const location: URL | undefined =
    document.location && new URL(document.location);

  const campaign = UTM.map(
    (key: string) =>
      (referrer && referrer.searchParams.get(key)) ||
      (location && location.searchParams.get(key)) ||
      window.sessionStorage.getItem(`__as.${key}`) ||
      undefined
  );

  return campaign.some(p => !!p) && new Campaign(...campaign);
};
