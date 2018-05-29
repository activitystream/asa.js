import Baker from "./baker";

beforeEach("cleanup user and session info", () => {
  for (let cookie in Baker.keys()) {
    Baker.removeItem(cookie);
  }
});
