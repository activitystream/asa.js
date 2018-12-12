import { expect } from "chai";
import sinon from "sinon";
import { document } from "./browser";
import { Dispatcher } from "./dispatcher";
import api from "./api";
import { createSession, destroySession } from "./session";
import { Event } from "./event";
import { Campaign } from "./campaign";

const locationStub: sinon.SinonStub = sinon.stub(document, "location");
const referrerStub: sinon.SinonStub = sinon.stub(document, "referrer");

export default describe("Campaigns", () => {
  let submitEventStub: sinon.SinonStub;
  let events: Event[] = [];

  const getNewTab = () => {
    const dispatcher: Dispatcher = new Dispatcher();
    destroySession();
    dispatcher("set.tenant.id", "AS-E2EAUTOTEST-A");
    return dispatcher;
  };

  const setCustomUTM = (dispatcher: Dispatcher) => {
    dispatcher("set.utm.aliases", {
      utm_source: ["my_source_param"],
      utm_campaign: ["my_campaign_param"]
    });
  };

  const findEvent = (type: string): Event =>
    events.find((event: Event) => event.type === type) as Event;

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

  it("should have campaign info", () => {
    locationStub.value(
      "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
    );
    referrerStub.value("http://smashbangpow.dk");
    const asa = getNewTab();
    asa("as.web.product.viewed", ["Product/1"]);
    const event: Event = findEvent("as.web.product.viewed");

    expect(event).to.be.ok;
    const campaign = event.campaign as Campaign;
    expect(campaign).to.be.an("object");
    expect(campaign.campaign).to.equals("testCampaign");
    expect(campaign.source).to.equals("testSource");
    expect(event.page.referrer).to.equals("smashbangpow.dk");
  });

  describe("UTM aliasing", () => {
    it("has campaign information", () => {
      locationStub.value(
        "http://fle.com/place?my_campaign_param=myCampaign&my_source_param=myUTMSource"
      );
      referrerStub.value("http://example.com");

      const asa = getNewTab();
      setCustomUTM(asa);

      asa("as.web.product.viewed", ["Product/1"]);

      const event: Event = findEvent("as.web.product.viewed");

      expect(event).to.be.ok;
      const campaign = event.campaign as Campaign;
      expect(campaign).to.be.an("object");
      expect(campaign.campaign).to.equal("myCampaign");
      expect(campaign.source).to.equal("myUTMSource");
      expect(event.page.referrer).to.equal("example.com");
    });
  });

  describe("Resume session", () => {
    it("opening two different tabs with two different campaigns", () => {
      locationStub.value(
        "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
      );
      referrerStub.value("http://smashbangpow.dk");
      const tab1 = getNewTab();
      tab1("as.web.product.viewed", ["Product/1"]);

      locationStub.value(
        "http://flo.com/place?utm_campaign=testCampaign1&utm_source=testSource1"
      );
      referrerStub.value("http://flipflop.dk");

      emptyEvents();
      const tab2 = getNewTab();
      tab2("as.web.product.viewed", ["Product/1"]);
      const event = findEvent("as.web.product.viewed");

      expect(event).to.be.ok;
      const campaign = event.campaign as Campaign;
      expect(campaign).to.be.an("object");
      expect(campaign.campaign).to.equals("testCampaign1");
      expect(campaign.source).to.equals("testSource1");
      expect(event.page.referrer).to.equals("flipflop.dk");
    });

    it("opening a tab from a campaign should not affect opening a tab with no campaign", () => {
      locationStub.value(
        "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
      );
      referrerStub.value("http://smashbangpow.dk");
      const tab1 = getNewTab();
      tab1("as.web.product.viewed", ["Product/1"]);

      locationStub.value("http://fle.com/place");
      referrerStub.value("");

      emptyEvents();

      const tab2 = getNewTab();
      tab2("as.web.product.viewed", ["Product/1"]);
      const event = findEvent("as.web.product.viewed");

      expect(event).to.be.ok;
      expect(event.campaign).to.deep.equal({});
      expect(event.page.referrer).to.equal(null);
    });

    it("campaign info should persist through following steps on a site", () => {
      locationStub.value(
        "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
      );
      referrerStub.value("http://smashbangpow.dk");
      const asa = getNewTab();
      asa("set.service.providers", ["http://paymentgw.gw"]);
      asa("as.web.product.viewed", ["Product/1"]);

      locationStub.value("http://fle.com/place2");
      referrerStub.value("http://fle.com/place");
      emptyEvents();
      asa("as.web.product.viewed", ["Product/1"]);

      const event: Event = findEvent("as.web.product.viewed");
      expect(event).to.be.ok;
      const campaign = event.campaign as Campaign;
      expect(campaign).to.be.an("object");
      expect(campaign.campaign).to.equals("testCampaign");
      expect(campaign.source).to.equals("testSource");
      expect(event.page.referrer).to.equals("smashbangpow.dk");
    });

    it("campaign info should persist through jumps over service provider", () => {
      locationStub.value(
        "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
      );
      referrerStub.value("http://smashbangpow.dk");
      const asa = getNewTab();
      asa("set.service.providers", ["http://paymentgw.gw"]);
      asa("as.web.product.viewed", ["Product/1"]);

      locationStub.value("http://fle.com/place2");
      referrerStub.value("http://fle.com/place");
      asa("set.service.providers", ["http://paymentgw.gw"]);
      asa("as.web.product.viewed", ["Product/1"]);

      locationStub.value("http://fle.com/place3");
      referrerStub.value("http://paymentgw.gw");

      emptyEvents();
      asa("set.service.providers", ["http://paymentgw.gw"]);
      asa("as.web.product.viewed", ["Product/1"]);

      const event = findEvent("as.web.product.viewed");
      expect(event).to.be.ok;
      const campaign = event.campaign as Campaign;
      expect(campaign).to.be.an("object");
      expect(campaign.campaign).to.equals("testCampaign");
      expect(campaign.source).to.equals("testSource");
      expect(event.page.referrer).to.equals("smashbangpow.dk");
    });

    // it('Crossdomain Partner and Session', function() {
    //     browser.document = {
    //         location: 'http://siteb.com/?buybekbea=aavekwwe&__asa=AS-E2EAUTOTEST%7C52770730.451c571a6556a2c69671b901430db663330b64ab&someotherparam=bla',
    //         referrerStub('http://sitea.com',
    //    };
    //     partners.setPartnerInfo();
    //     asa('set.service.providers', 'http://siteb.com/?buybekbea=aavekwwe&__asa=AS-E2EAUTOTEST%7C52770730.451c571a6556a2c69671b901430db663330b64ab&someotherparam=bla');
    //     asa('as.web.product.viewed');
    //     asa('as.web.product.searched', {});
    //
    //     var event = findEvent('as.web.product.searched');
    //     expect(event).to.be.ok;
    //     console.log(event);
    //     expect(event.page.referrer).to.equals('http://sitea.com');
    //     expect(event.partnerId).to.equals('AS-E2EAUTOTEST');
    //     expect(event.partnerSId).to.equals('52770730.451c571a6556a2c69671b901430db663330b64ab');
    // });
  });
});
