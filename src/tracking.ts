/**
 * @module tracking
 */

import { getSession } from "./session";
import * as browser from "./browser";
import { UTM } from "./campaign";
import { PARTNER_ID_KEY, PARTNER_SID_KEY } from "./partner";

export function sections() {
  const locationHashChanged = (oldHash, newHash) => {
    window.asa("sectionentered", newHash.substr(1));
  };
  let storedHash = "";
  setInterval(() => {
    if (browser.window.location.hash != storedHash) {
      const newHash: string = browser.window.location.hash;
      locationHashChanged(storedHash, newHash);
      storedHash = newHash;
    }
  }, 100);
}
export function track(tenant: string, domains: string[]): void {
  const domainsTracked: string[] = domains;
  const tracker = ({ target }: Event & { target: HTMLAnchorElement }): void => {
    let href: string = target.href;
    if (href) {
      const destination: URL = new URL(href);
      if (~domainsTracked.indexOf(destination.host)) {
        destination.searchParams.set(PARTNER_ID_KEY, tenant);
        destination.searchParams.set(PARTNER_SID_KEY, getSession().id);

        UTM.forEach((key: string) => {
          const value: string = browser.window.sessionStorage.getItem(
            `__as.${key}`
          );
          if (value) {
            destination.searchParams.set(key, value);
          }
        });
        target.href = destination.href;
      }
    }
  };
  document.addEventListener("mousedown", tracker);
  document.addEventListener("keyup", tracker);
  document.addEventListener("touchstart", tracker);
}
