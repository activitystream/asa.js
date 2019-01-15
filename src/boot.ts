import { setPartnerInfo } from "./partner";
import logger from "./logger";
import { Dispatcher } from "./dispatcher";
import api from "./api";

declare global {
  interface Window {
    asa: Dispatcher;
  }
}

export type QueueItem = [string, any, any];

export default (): void => {
  try {
    const queue: QueueItem[] = (window.asa && window.asa["q"]) || [];
    const attrs = {
      location: new URL(document.location.toString()),
      referrer: document.referrer ? new URL(document.referrer) : undefined,
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
