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
    events.find((event: Event) => event.type === type);

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

  it("page view message should include all details of the product", () => {
    const asa = getNewTab();
    asa("as.web.product.viewed", [
      {
        description: "SATURDAY NIGHT FEVER - THE MUSICAL",
        id: "1-4034344",
        product_variant: "Floor",
        price_category: "A",
        item_price: "222",
        currency: "DKK",
        categories: ["Teater", "Musical"]
      }
    ]);
    const event: Event = findEvent("as.web.product.viewed");
    expect(event.products.length).to.equal(1);
    expect(event.products[0].description).to.equal(
      "SATURDAY NIGHT FEVER - THE MUSICAL"
    );
    expect(event.products[0].id).to.equal("1-4034344");
    expect(event.products[0].product_variant).to.equal("Floor");
    expect(event.products[0].price_category).to.equal("A");
    expect(event.products[0].item_price).to.equal("222");
    expect(event.products[0].currency).to.equal("DKK");
    expect(event.products[0].categories.join(",")).to.equal("Teater,Musical");
  });

  it("product availabilty message should include all details of the product", () => {
    const asa = getNewTab();
    asa("as.web.product.availability.checked", [
      {
        description: "SATURDAY NIGHT FEVER - THE MUSICAL",
        id: "1-4034344",
        product_variant: "Floor",
        price_category: "A",
        item_price: "222",
        currency: "DKK",
        categories: ["Teater", "Musical"]
      }
    ]);
    const event: Event = findEvent("as.web.product.availability.checked");
    expect(event.products.length).to.equal(1);
    expect(event.products[0].description).to.equal(
      "SATURDAY NIGHT FEVER - THE MUSICAL"
    );
    expect(event.products[0].id).to.equal("1-4034344");
    expect(event.products[0].product_variant).to.equal("Floor");
    expect(event.products[0].price_category).to.equal("A");
    expect(event.products[0].item_price).to.equal("222");
    expect(event.products[0].currency).to.equal("DKK");
    expect(event.products[0].categories.join(",")).to.equal("Teater,Musical");
  });
});
