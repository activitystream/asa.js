import * as session from "./session";
import * as microdata from "./microdata";
import * as autoTrack from "./auto_track";
import * as debug from "./debug";
import { WebEvent } from "./event";
import server from "./server";
import * as user from "./user";
import getCampaign from "./campaign";
import getReferrer from "./referrer";
import { window, document } from "./browser";
import parser from "./parseuri";
import { setPartnerInfo } from "./partner";

export interface Asa {
  (event: WebEvent.Event, data?, ...rest): Asa;

  id?: string; // tenant id
  transport: (data: any) => Asa;
}

function Asa(tenant?: string): void {
  let serviceProviders = [];
  let sessionResumed = false;

  setPartnerInfo();

  interface LocalEvents {}
  const LocalEvents = {
    "custom.session.created": (data, ...rest) =>
      session.customSession(data, rest[0], rest[1]),
    "connected.partners.provided": data => autoTrack.links(data),
    "service.providers.provided": data => {
      serviceProviders = data;
    },
    "tenant.id.provided": data => {
      window.asa.id = data;
    },
    "debug.mode.enabled": data => debug.setDebugMode(data),
    "microdata.transformer.provided": data => microdata.setMapper(data)
  };

  const instance: any = function Asa(
    event: new (data?: any, ...rest) => WebEvent.Event | keyof LocalEvents,
    data?,
    ...rest
  ): Asa {
    try {
      if (typeof event === "string" && event in LocalEvents) {
        LocalEvents[event](data, ...rest);
        return;
      }

      const campaign = getCampaign();
      const referrer = getReferrer(
        document.location,
        document.referrer,
        serviceProviders
      );
      if (!session.hasSession()) {
        debug.log("no session, starting a new one");
        session.createSession({ campaign, referrer });
        sessionResumed = true;
        instance.transport(
          new WebEvent.session.started({
            newBrowser: user.isUserNew()
          })
        );
      } else {
        const referrerAuth = parser.parseURI(document.referrer).authority;
        const currentAuth = parser.parseURI(document.location).authority;
        if (
          referrerAuth !== currentAuth &&
          serviceProviders.indexOf(referrerAuth) === -1
        ) {
          session.updateTimeout({ campaign, referrer });
          debug.log("session resumed");
          sessionResumed = true;
          instance.transport(new WebEvent.session.resumed());
        }
      }

      instance.transport(new event(data, ...rest));
    } catch (e) {
      debug.forceLog("inbox exception:", e);
      server.submitError(e, {
        location: "processing inbox message",
        arguments: [event, data, ...rest]
      });
    }
    return instance;
  };

  instance.id = tenant;
  instance.transport = data => {
    server.submitEvent(data);
    return instance;
  };

  return <void>instance;
}

export default Asa;
