import parser from "./parseuri";
import { window, document } from "./browser";

const { sessionStorage } = window;

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
  let campaignKeys;

  const referrer: any = document.referrer && new URL(document.referrer);
  const location: any = document.location && new URL(document.location);

  const campaign = UTM.reduce(
    (acc, curr) => {
      const value =
        (referrer && referrer.searchParams.get(curr)) ||
        (location && location.searchParams.get(curr)) ||
        sessionStorage.getItem(`__as.${curr}`);

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
