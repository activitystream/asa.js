import Baker from "./baker";
import { PARTNER_ID_KEY, PARTNER_SID_KEY } from "./partner";

beforeEach("cleanup user and session info", () => {
  for (let cookie in Baker.keys()) {
    Baker.removeItem(cookie);
  }
  window.sessionStorage.removeItem(PARTNER_ID_KEY);
  window.sessionStorage.removeItem(PARTNER_SID_KEY);
});
