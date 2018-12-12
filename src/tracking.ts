/**
 * @module tracking
 */

import { getSession } from "./session";
import * as browser from "./browser";
import { mapUTM } from "./campaign";
import { key } from "./partner";

const isAnchor = (target: any): target is HTMLAnchorElement =>
  target && "href" in target;
const isFormElement = (target: any): target is HTMLInputElement =>
  target && "form" in target;
export function track(tenant: string, domains: string[]): void {
  const domainsTracked: string[] = domains;
  const tracker = ({
    target
  }: MouseEvent | KeyboardEvent | TouchEvent): void => {
    if (!target) return;
    if (isAnchor(target)) {
      const destination: URL = new URL(target.href);
      if (~domainsTracked.indexOf(destination.host)) {
        destination.searchParams.set(key("PARTNER_ID_KEY"), tenant);
        destination.searchParams.set(key("PARTNER_SID_KEY"), getSession().id);

        mapUTM((key: string) => {
          const value = browser.window.sessionStorage.getItem(`__as.${key}`);
          if (value) {
            destination.searchParams.set(key, value);
          }
        });
        target.href = destination.href;
      }
    } else if (isFormElement(target)) {
      const inputs: HTMLInputElement[] = ["input", "input"].map(
        document.createElement as any
      );
      inputs[0].name = key("PARTNER_ID_KEY");
      inputs[0].value = tenant;
      inputs[1].name = key("PARTNER_SID_KEY");
      inputs[1].value = getSession().id;
      inputs.forEach((input: HTMLInputElement) => {
        input.type = "hidden";
        target.form && target.form.appendChild(input);
      });
    }
  };
  document.addEventListener("mousedown", tracker);
  document.addEventListener("keyup", tracker);
  document.addEventListener("touchstart", tracker);
}
