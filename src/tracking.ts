/**
 * @module tracking
 */

import { SessionManager } from "./session";
import { mapUTM } from "./campaign";
import { KEY } from "./partner";

interface TrackAttrs {
  tenant: string;
  domains: string[];
  session: SessionManager;
}

const isAnchor = (target: any): target is HTMLAnchorElement =>
  target && "href" in target;
const isFormElement = (target: any): target is HTMLInputElement =>
  target && "form" in target;
export function track({ session, tenant, domains }: TrackAttrs): void {
  const domainsTracked: string[] = domains;
  const appendConnectedPartnerParameters = (target: HTMLAnchorElement) => {
    const destination: URL = new URL(target.href);
    if (~domainsTracked.indexOf(destination.host)) {
      destination.searchParams.set(KEY.PARTNER_ID_KEY, tenant);
      destination.searchParams.set(
        KEY.PARTNER_SID_KEY,
        session.getSession().id
      );
      const campaign = session.getSession().campaign || {};
      mapUTM((key: string) => {
        const value = campaign[key.substr(4)];
        if (value) {
          destination.searchParams.set(key, value);
        }
      });
      target.href = destination.href;
    }
  };
  const tracker = ({
    target
  }: MouseEvent | KeyboardEvent | TouchEvent): void => {
    if (!target) return;
    if (isAnchor(target)) {
      appendConnectedPartnerParameters(target);
    } else if (isFormElement(target)) {
      const inputs: HTMLInputElement[] = ["input", "input"].map(
        document.createElement as any
      );
      inputs[0].name = KEY.PARTNER_ID_KEY;
      inputs[0].value = tenant;
      inputs[1].name = KEY.PARTNER_SID_KEY;
      inputs[1].value = session.getSession().id;
      inputs.forEach((input: HTMLInputElement) => {
        input.type = "hidden";
        target.form && target.form.appendChild(input);
      });
    } else {
      const element = target as Element;
      const parentWithHref = element.closest && element.closest("[href]");
      if (parentWithHref && isAnchor(parentWithHref)) {
        appendConnectedPartnerParameters(parentWithHref);
      }
    }
  };
  document.addEventListener("mousedown", tracker);
  document.addEventListener("keyup", tracker);
  document.addEventListener("touchstart", tracker);
}
