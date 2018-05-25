import * as partner from "./partner";
import * as autoTrack from "./auto_track";
import * as debug from "./debug";
import Inbox from "./inbox";
import server from "./server";
import * as features from "./features";
import { WebEvent } from "./event";

const runBootSequence = (bootSequence: any[]) => {
  bootSequence = bootSequence || [];
  if (!(bootSequence instanceof Array)) bootSequence = [bootSequence];

  for (let i = 0; i < bootSequence.length; i++) {
    window.asa.apply(null, bootSequence[i]);
  }
};

export default (bootSequence: any[] = []) => {
  // if (DNT && (DNT === 'yes' || DNT.charAt(0) === '1')) return;

  try {
    const pendingEvents = (window.asa && window.asa.q) || [];

    window.asa = new Inbox();
    window["WebEvent"] = WebEvent;

    // features.defineExperiment(features.MINI_AJAX, 10);
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
