import { window, document } from "./browser";

export interface Campaign {
  campaign?: string;
  medium?: string;
  source?: string;
  content?: string;
  term?: string;
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

export const UTM = [
  "utm_medium",
  "utm_source",
  "utm_campaign",
  "utm_content",
  "utm_term"
];

export default () => {
  const referrer: URL | undefined =
    document.referrer && new URL(document.referrer);
  const location: URL | undefined =
    document.location && new URL(document.location);

  const campaign = UTM.reduce(
    (acc, curr) => {
      const value =
        (referrer && referrer.searchParams.get(curr)) ||
        (location && location.searchParams.get(curr)) ||
        window.sessionStorage.getItem(`__as.${curr}`);

      return value
        ? {
            ...acc,
            [curr]: value
          }
        : acc;
    },
    null as any
  );

  return (
    campaign &&
    new Campaign(
      campaign.utm_campaign,
      campaign.utm_medium,
      campaign.utm_source,
      campaign.utm_content,
      campaign.utm_term
    )
  );
};
