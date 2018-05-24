import * as session from "./session";
import { expect } from "chai";

export default describe("session", () => {
  before(() => {
    session.resetSessionMgmt();
    session.destroySession();
  });

  describe("has session", () => {
    it("has session is false before session has been created", () => {
      expect(session.hasSession()).to.be.false;
    });
    it("has session is true after session has been created", () => {
      session.createSession();
      expect(session.hasSession()).to.be.true;
    });
  });

  describe("store stuff in session", () => {
    it("should store data in session and give it back", () => {
      session.createSession({ fle: "flo" });
      expect(session.getSession().fle).to.equals("flo");
    });

    it("should update data in session", () => {
      session.createSession({ fle: "flo" });
      session.updateTimeout({ fle: "fle" });
      expect(session.getSession().fle).to.equals("fle");
    });
  });

  describe("session id", () => {
    it("should generate one", () => {
      session.createSession();
      expect(session.getSession().id).to.be.a("string");
    });
  });

  describe("update session timeout", () => {
    it("should update expiry time", done => {
      session.createSession();
      const timeout1 = session.getSession().t;
      setTimeout(() => {
        try {
          session.updateTimeout();
          const timeout2 = session.getSession().t;
          expect(timeout1).to.be.not.equals(timeout2);
          done();
        } catch (e) {
          done(e);
        }
      }, 10);
    });
  });
});
