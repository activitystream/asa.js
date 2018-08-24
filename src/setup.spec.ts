import Baker from "./baker";
import { key } from "./partner";

beforeEach("cleanup user and session info", () => {
  for (let cookie in Baker.keys()) {
    Baker.removeItem(cookie);
  }
  window.sessionStorage.removeItem(key("PARTNER_ID_KEY"));
  window.sessionStorage.removeItem(key("PARTNER_SID_KEY"));
});
