import { expect } from "chai";
import sinon from "sinon";
import { document } from "./browser";
import { Dispatcher } from "./dispatcher";
import api from "./api";
import { createSession, destroySession } from "./session";
import { Event } from "./event";
import { PARTNER_ID_KEY, PARTNER_SID_KEY, setPartnerInfo } from "./partner";

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
    events.find((event: Event) => event.type === type);

  const emptyEvents = () => {
    while (events.length) events.pop();
  };

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
      `http://fle.com/place?${PARTNER_ID_KEY}=AS-E2EAUTOTEST-A&${PARTNER_SID_KEY}=123`
    );
    referrerStub.value("http://siteb.com");
    setPartnerInfo();
    const asa = getNewTab();
    asa("as.web.product.viewed", {
      location: window.location.href,
      title: document.title
    });
    asa("as.web.product.searched", {});
    const event: Event = findEvent("as.web.product.searched");

    expect(event).to.be.ok;
    expect(event.partner_id).to.be.a("string");
    expect(event.partner_id).to.equal("AS-E2EAUTOTEST-A");
  });
});
