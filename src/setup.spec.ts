import Baker from "./baker";
import { setPartnerInfo } from "./partner";

beforeEach("cleanup user and session info", () => {
  for (let cookie in Baker.keys()) {
    Baker.removeItem(cookie);
  }
});
