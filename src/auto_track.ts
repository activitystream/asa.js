import session from "./session";
import parser from "./parseuri";
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
      const newHash = browser.window.location.hash;
      locationHashChanged(storedHash, newHash);
      storedHash = newHash;
    }
  }, 100);
}
export function links(domains: string[]) {
  const domainsTracked = domains;
  const tracker = ({ target }) => {
    let href = target.href;
    if (href) {
      const destination: URL = new URL(href);
      if (~domainsTracked.indexOf(destination.host)) {
        destination.searchParams.set(PARTNER_ID_KEY, browser.window.asa.id);
        destination.searchParams.set(PARTNER_SID_KEY, session.getSession().id);

        UTM.forEach(key => {
          const value = browser.window.sessionStorage.getItem(`__as.${key}`);
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
