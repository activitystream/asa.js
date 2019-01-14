/**
 * @module campaign
 */

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

interface CampaignAttrs {
  location: URL;
  referrer?: URL;
  storage: Storage;
}

export default ({ referrer, location, storage }: CampaignAttrs): Campaign => {
  const campaign: Campaign = {};
  mapUTM((key, value) => {
    const val = value
      .map(
        key =>
          (referrer && referrer.searchParams.get(key)) ||
          location.searchParams.get(key) ||
          storage.getItem(`__as.${key}`)
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
