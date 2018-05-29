import * as partner from "./partner";
import * as debug from "./debug";
import inbox from "./inbox";
import server from "./server";
import * as features from "./features";
import { AsaEvent } from "./event";

const runBootSequence: (bootSequence: AsaEvent.Type[]) => void = (
  bootSequence: AsaEvent.Type[] = []
): void => {
  if (!Array.isArray(bootSequence)) bootSequence = [bootSequence];

  for (let i = 0; i < bootSequence.length; i++) {
    window.asa.apply(null, bootSequence[i]);
  }
};

export default (bootSequence: AsaEvent.Type[] = []): void => {
  // if (DNT && (DNT === 'yes' || DNT.charAt(0) === '1')) return;

  try {
    const pendingEvents: AsaEvent.Type[] =
      (window.asa && window.asa["q"]) || [];

    window.asa = inbox;

    features.defineExperiment(features.MINI_AJAX, 10);
    partner.setPartnerInfo();
    runBootSequence(bootSequence);

    for (let i = 0; i < pendingEvents.length; i++) {
      window.asa.apply(null, pendingEvents[i]);
    }

    // autoTrack.sections();
  } catch (e) {
    debug.forceLog("exception during init: ", e);
    server.submitError(e, { location: "boot script" });
  }
};
