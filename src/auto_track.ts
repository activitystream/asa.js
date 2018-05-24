import * as session from "./session";
import parser from "./parseuri";
import * as browser from "./browser";

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
export function links(domains) {
  const domainsTracked = domains;
  const tracker = ({ target }) => {
    let href = target.href;
    if (href) {
      const destination: any = parser.parseURI(href);
      if (domainsTracked.indexOf(destination.authority) > -1) {
        if (!destination.queryKey["__asa"]) {
          const alreadyHasParams = target.href.indexOf("?") !== -1;
          href = `${href +
            (alreadyHasParams ? "&" : "?")}__asa=${encodeURIComponent(
            `${browser.window.asa.id}|${session.getSession().id}`
          )}`;
          target.href = href;
        }
        const utmKeys = [
          "utm_medium",
          "utm_source",
          "utm_campaign",
          "utm_content",
          "utm_term"
        ];
        const __as__campagin = {};
        utmKeys.forEach(utm_key => {
          const utm_value = browser.window.sessionStorage.getItem(
            `__as.${utm_key}`
          );
          if (utm_value) {
            __as__campagin[utm_key] = utm_value;
          }
        });
        if (Object.keys(__as__campagin).length) {
          if (
            !Object.keys(destination.queryKey).some(
              key => key.indexOf("utm_") !== -1
            )
          ) {
            const hasParams = href.indexOf("?") !== -1;
            Object.keys(__as__campagin).forEach((d, i) => {
              href = `${href +
                (!hasParams && i === 0 ? "?" : "&") +
                d}=${encodeURIComponent(__as__campagin[d])}`;
            });
            target.href = href;
          }
        }
      }
    }
  };
  document.addEventListener("mousedown", tracker);
  document.addEventListener("keyup", tracker);
  document.addEventListener("touchstart", tracker);
}
