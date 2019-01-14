import Baker from "./baker";
import { KEY } from "./partner";

beforeEach("cleanup user and session info", () => {
  for (let cookie in Baker.keys()) {
    Baker.removeItem(cookie);
  }
  window.sessionStorage.removeItem(KEY.PARTNER_ID_KEY);
  window.sessionStorage.removeItem(KEY.PARTNER_SID_KEY);
});
