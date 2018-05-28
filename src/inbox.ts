import getCampaign, { Campaign } from "./campaign";
import * as debug from "./debug";
import { AsaEvent } from "./event";
import { document } from "./browser";
import parser from "./parseuri";
import server from "./server";
import session from "./session";

export interface Inbox {
  (name: AsaEvent.Type, ...data: any[]): Inbox;

  id?: string; // tenant id
  transport?(event: AsaEvent.Event): void;
  providers?: string[];
}

export function Inbox(tenant?: string): void {
  session.destroySession();

  const instance: Inbox = function Inbox(
    name: AsaEvent.Type,
    ...data: any[]
  ): Inbox {
    try {
      if (!AsaEvent.web[name]) {
        if (AsaEvent.local[name]) {
          AsaEvent.local[name].call(instance, ...data);
        }
        return;
      }
      const campaign: Campaign = getCampaign();
      const referrer: string = getReferrer();
      if (!session.hasSession()) {
        debug.log("no session, starting a new one");
        session.createSession({
          campaign,
          referrer
        });
      } else if (referrer) {
        session.updateTimeout({
          campaign,
          referrer
        });
        debug.log("session resumed");
      }

      instance.transport(new AsaEvent.web[name](...data));
    } catch (error) {
      debug.forceLog("inbox exception:", error);
      server.submitError(error, {
        location: "processing inbox message",
        arguments: [event, ...data]
      });
    }
    return instance;
  };

  instance.id = tenant;
  instance.transport = (event: AsaEvent.Event): void => {
    server.submitEvent(event);
  };
  instance.providers = [];

  const getReferrer = (): string => {
    const referrer: string = parser.getAuthority(document.referrer);
    const location: string = parser.getAuthority(document.location);

    return referrer &&
      referrer !== location &&
      !~instance.providers.indexOf(referrer)
      ? referrer
      : null;
  };

  return (instance as any) as void;
}

export default new Inbox();
