import { setPartnerInfo } from "./partner";
import logger from "./logger";
import { Dispatcher } from "./dispatcher";
import api from "./api";
import { ASA_REFERRER_KEY } from "./constants";

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
    const asaReffererParam = location.searchParams.get(ASA_REFERRER_KEY);
    let partnerReferrer;
    try {
      if (asaReffererParam) {
        partnerReferrer = new URL(asaReffererParam);
      }
    } catch (e) {
      partnerReferrer = undefined;
    }
    const documentReferrer = document.referrer
      ? new URL(document.referrer)
      : undefined;

    const referrer = partnerReferrer || documentReferrer;
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
