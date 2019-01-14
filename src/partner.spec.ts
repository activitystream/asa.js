import { expect } from "chai";
import sinon from "sinon";
import { document } from "./browser";
import { Dispatcher, DispatcherAttrs } from "./dispatcher";
import api from "./api";
import { Event } from "./event";
import { setPartnerInfo, KEY } from "./partner";
import { storageAPI } from "./storage";

const locationStub: sinon.SinonStub = sinon.stub(document, "location");
const referrerStub: sinon.SinonStub = sinon.stub(document, "referrer");

export default describe("Partner", () => {
  let submitEventStub: sinon.SinonStub;
  let events: Event[] = [];

  const getNewTab = (): Dispatcher & { attrs: DispatcherAttrs } => {
    const attrs = {
      location: new URL(document.location),
      referrer: new URL(document.referrer),
      title: "",
      storage: storageAPI()
    };
    const dispatcher: any = Dispatcher(attrs);
    dispatcher("set.tenant.id", "AS-E2EAUTOTEST-B");
    dispatcher.attrs = attrs;
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
      `http://fle.com/place?${KEY.PARTNER_ID_KEY}=AS-E2EAUTOTEST-A&${
        KEY.PARTNER_SID_KEY
      }=123`
    );
    referrerStub.value("http://siteb.com");
    const asa = getNewTab();
    setPartnerInfo(asa.attrs);
    asa("as.web.product.viewed", ["Product/1"]);
    const event: Event = findEvent("as.web.product.viewed");

    expect(event).to.be.ok;
    expect(event.partner_id).to.be.a("string");
    expect(event.partner_id).to.equal("AS-E2EAUTOTEST-A");
  });
  it("should have partner info when UTM keys are custom", () => {
    KEY.PARTNER_ID_KEY = "foo";
    KEY.PARTNER_SID_KEY = "bar";
    locationStub.value(
      `http://fle.com/place?${KEY.PARTNER_ID_KEY}=AS-E2EAUTOTEST-A&${
        KEY.PARTNER_SID_KEY
      }=123`
    );
    referrerStub.value("http://siteb.com");
    const asa = getNewTab();
    setPartnerInfo(asa.attrs);
    asa("as.web.product.viewed", ["Product/1"]);
    const event: Event = findEvent("as.web.product.viewed");

    expect(event).to.be.ok;
    expect(event.partner_id).to.be.a("string");
    expect(event.partner_id).to.equal("AS-E2EAUTOTEST-A");
  });
});
