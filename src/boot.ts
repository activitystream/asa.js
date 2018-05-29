import { setPartnerInfo } from "./partner";
import logger from "./logger";
import dispatcher from "./dispatcher";
import api from "./api";
import { AsaEvent } from "./event";

export default (): void => {
  try {
    const queue: AsaEvent.Type[] = (window.asa && window.asa["q"]) || [];
    window.asa = dispatcher;

    setPartnerInfo();
    queue.forEach(event => window.asa(event));
  } catch (e) {
    logger.force("exception during init: ", e);
    api.submitError(e, { location: "boot script" });
  }
};
