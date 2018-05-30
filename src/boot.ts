import { setPartnerInfo } from "./partner";
import logger from "./logger";
import dispatcher, { Dispatcher } from "./dispatcher";
import api from "./api";
import { Type } from "./event";

export default (): void => {
  try {
    const queue: Type[] = (window.asa && window.asa["q"]) || [];
    window.asa = dispatcher;

    setPartnerInfo();
    queue.forEach((event: Type): Dispatcher => window.asa(event));
  } catch (e) {
    logger.force("exception during init: ", e);
    api.submitError(e, { location: "boot script" });
  }
};
