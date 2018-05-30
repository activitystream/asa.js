import { setPartnerInfo } from "./partner";
import logger from "./logger";
import dispatcher, { Dispatcher } from "./dispatcher";
import api from "./api";
import { Type } from "./event";

export type QueueItem = [Type, any, any];

export default (): void => {
  try {
    const queue: QueueItem[] = (window.asa && window.asa["q"]) || [];
    window.asa = dispatcher;

    setPartnerInfo();
    queue.forEach((args: QueueItem): Dispatcher =>
      dispatcher.apply(null, args)
    );
  } catch (e) {
    logger.force("exception during init: ", e);
    api.submitError(e, { location: "boot script" });
  }
};
