import { expect } from "chai";
import sinon from "sinon";
import { document } from "./browser";
import { Dispatcher } from "./dispatcher";
import api from "./api";
import { destroySession } from "./session";
import { Event } from "./event";
import { key, setPartnerInfo } from "./partner";

const locationStub: sinon.SinonStub = sinon.stub(document, "location");
const referrerStub: sinon.SinonStub = sinon.stub(document, "referrer");

export default describe("Partner", () => {
  let submitEventStub: sinon.SinonStub;
  let events: Event[] = [];

  const getNewTab = () => {
    const dispatcher: Dispatcher = new Dispatcher();
    destroySession();
    dispatcher("set.tenant.id", "AS-E2EAUTOTEST-B");
    return dispatcher;
  };

  const findEvent = (type: string): Event =>
    events.find((event: Event) => event.type === type) as Event;

  beforeEach(() => {
    events = [];
  });

  afterEach(() => {
    locationStub.restore();
    referrerStub.restore();
  });

  before(() => {
    submitEventStub = sinon.stub(api, "submitEvent");
    submitEventStub.value(ev => {
      events.push(ev);
    });
  });

  after(() => {
    submitEventStub.restore();
  });

  it("should have partner info", () => {
    locationStub.value(
      `http://fle.com/place?${key("PARTNER_ID_KEY")}=AS-E2EAUTOTEST-A&${key(
        "PARTNER_SID_KEY"
      )}=123`
    );
    referrerStub.value("http://siteb.com");
    setPartnerInfo();
    const asa = getNewTab();
    asa("as.web.product.viewed", ["Product/1"]);
    const event: Event = findEvent("as.web.product.viewed");

    expect(event).to.be.ok;
    expect(event.partner_id).to.be.a("string");
    expect(event.partner_id).to.equal("AS-E2EAUTOTEST-A");
  });
  it("should have partner info when UTM keys are custom", () => {
    key("PARTNER_ID_KEY", "foo");
    key("PARTNER_SID_KEY", "bar");
    locationStub.value(
      `http://fle.com/place?${key("PARTNER_ID_KEY")}=AS-E2EAUTOTEST-A&${key(
        "PARTNER_SID_KEY"
      )}=123`
    );
    referrerStub.value("http://siteb.com");
    setPartnerInfo();
    const asa = getNewTab();
    asa("as.web.product.viewed", ["Product/1"]);
    const event: Event = findEvent("as.web.product.viewed");

    expect(event).to.be.ok;
    expect(event.partner_id).to.be.a("string");
    expect(event.partner_id).to.equal("AS-E2EAUTOTEST-A");
  });
});
