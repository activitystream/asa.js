import { setPartnerInfo } from "./partner";
import logger from "./logger";
import { Dispatcher } from "./dispatcher";
import api from "./api";
import { ASA_REFFERER_PARAM } from "./constants";

declare global {
  interface Window {
    asa: Dispatcher;
  }
}

export type QueueItem = [string, any, any];

export default (): void => {
  try {
    const queue: QueueItem[] = (window.asa && window.asa["q"]) || [];
    const location = new URL(document.location.toString());
    const asaReffererParam = location.searchParams.get(ASA_REFFERER_PARAM);
    let partnerRefferer;
    try {
      if (asaReffererParam) {
        partnerRefferer = new URL(asaReffererParam);
      }
    } catch (e) {
      partnerRefferer = undefined;
    }
    const documetReferrer = document.referrer
      ? new URL(document.referrer)
      : undefined;

    const referrer = partnerRefferer || documetReferrer;
    const attrs = {
      location,
      referrer,
      storage: sessionStorage,
      title: document.title
    };
    window.asa = Dispatcher(attrs);
    setPartnerInfo(attrs);

    queue.forEach(
      // @ts-ignore: We trust this
      (args: QueueItem): Dispatcher => window.asa(...args)
    );
  } catch (e) {
    logger.force("exception during init: ", e);
    api.submitError(e, { location: "boot script" });
  }
};
