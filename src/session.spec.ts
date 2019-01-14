import { createSessionManager, SessionManager } from "./session";
import { expect } from "chai";
import { storageAPI } from "./storage";
import { createUserManager } from "./user";

export default describe("session", () => {
  let session: SessionManager;
  const attrs = {
    location: new URL("https://example.com"),
    referrer: new URL("https://example2.com"),
    storage: storageAPI()
  };
  const user = createUserManager(attrs);

  const sessionAttrs = {
    ...attrs,
    user,
    isPartner: false,
    tenant: "testererer"
  };
  before(() => {
    session = createSessionManager(sessionAttrs);
  });

  describe("has session", () => {
    it("has session is false before session has been created", () => {
      expect(session.hasSession()).to.be.false;
    });
    it("has session is true after session has been created", () => {
      session.createSession(sessionAttrs);
      expect(session.hasSession()).to.be.true;
    });
  });

  describe("store stuff in session", () => {
    it("should store data in session and give it back", () => {
      session.createSession({ ...sessionAttrs, data: { fle: "flo" } });
      const data = session.getSession().data || {};
      expect(data.fle).to.equals("flo");
    });

    it("should update data in session", () => {
      session.createSession({ ...sessionAttrs, data: { fle: "flo" } });
      session.refreshSession({ ...sessionAttrs, data: { fle: "fle" } });
      const data = session.getSession().data || {};
      expect(data.fle).to.equals("fle");
    });
  });

  describe("session id", () => {
    it("should generate one", () => {
      session.createSession(sessionAttrs);
      expect(session.getSession().id).to.be.a("string");
    });
  });

  describe("update session timeout", () => {
    it("should update expiry time", done => {
      session.createSession(sessionAttrs);
      const timeout1 = session.getSession().t;
      setTimeout(() => {
        try {
          session.refreshSession(sessionAttrs);
          const timeout2 = session.getSession().t;
          expect(timeout1).to.not.be.equals(timeout2);
          done();
        } catch (e) {
          done(e);
        }
      }, 10);
    });
  });
});
