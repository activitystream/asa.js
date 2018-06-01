import {
  resetManager,
  hasSession,
  getSession,
  createSession,
  destroySession,
  refreshSession
} from "./session";
import { expect } from "chai";

export default describe("session", () => {
  before(() => {
    resetManager();
    destroySession();
  });

  describe("has session", () => {
    it("has session is false before session has been created", () => {
      expect(hasSession()).to.be.false;
    });
    it("has session is true after session has been created", () => {
      createSession();
      expect(hasSession()).to.be.true;
    });
  });

  describe("store stuff in session", () => {
    it("should store data in session and give it back", () => {
      createSession({ fle: "flo" });
      expect(getSession().fle).to.equals("flo");
    });

    it("should update data in session", () => {
      createSession({ fle: "flo" });
      refreshSession({ fle: "fle" });
      expect(getSession().fle).to.equals("fle");
    });
  });

  describe("session id", () => {
    it("should generate one", () => {
      createSession();
      expect(getSession().id).to.be.a("string");
    });
  });

  describe("update session timeout", () => {
    it("should update expiry time", done => {
      createSession();
      const timeout1 = getSession().t;
      setTimeout(() => {
        try {
          refreshSession();
          const timeout2 = getSession().t;
          expect(timeout1).to.be.not.equals(timeout2);
          done();
        } catch (e) {
          done(e);
        }
      }, 10);
    });
  });
});
