import * as session from "./session";
import Inbox from "./inbox";
// import partners from './partner';
import { expect } from "chai";
import * as info from "./version";
import * as features from "./features";
import { document } from "./browser";
import * as debug from "./debug";
import sinon from "sinon";
import { WebEvent } from "./event";
import server from "./server";

const locationStub = sinon.stub(document, "location");
const referrerStub = sinon.stub(document, "referrer");
const submitEventStub = sinon.stub(server, "submitEvent");

export default describe("Campaigns", () => {
  let events: any[] = [];
  let asa;

  const getNewTab = () => new Inbox(null);

  const findEvent = ev => events.find(event => event instanceof ev);

  const emptyEvents = () => {
    while (events.length) events.pop();
  };

  beforeEach(() => {
    events = [];
    asa = getNewTab();
  });

  afterEach(() => {
    locationStub.restore();
    referrerStub.restore();
    session.createSession({});
  });

  before(() => {
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
    asa(WebEvent.page.viewed, {
      location: window.location.href,
      title: document.title
    });
    asa(WebEvent.as.web.product.searched, {});
    const event = findEvent(WebEvent.as.web.product.searched);
    expect(event).to.be.ok;
    expect(event.campaign).to.be.an("object");
    expect(event.campaign.campaign).to.equals("testCampaign");
    expect(event.campaign.source).to.equals("testSource");
    expect(event.page.referrer).to.equals("http://smashbangpow.dk");
  });

  describe("Resume session", () => {
    it("opening two different tabs with two different campaigns", () => {
      locationStub.value(
        "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
      );
      referrerStub.value("http://smashbangpow.dk");
      asa(WebEvent.page.viewed, {
        location: window.location.href,
        title: document.title
      });
      asa(WebEvent.as.web.product.searched, {});

      locationStub.value(
        "http://flo.com/place?utm_campaign=testCampaign1&utm_source=testSource1"
      );
      referrerStub.value("http://flipflop.dk");

      emptyEvents();
      const tab2 = getNewTab();
      tab2(WebEvent.page.viewed);
      tab2(WebEvent.as.web.product.searched, {});
      const event = findEvent(WebEvent.as.web.product.searched);

      expect(event).to.be.ok;
      expect(event.campaign.campaign).to.equals("testCampaign1");
      expect(event.campaign.source).to.equals("testSource1");
      expect(event.page.referrer).to.equals("http://flipflop.dk");
    });

    it("opening a tab from a campaign should not affect opening a tab with no campaign", () => {
      locationStub.value(
        "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
      );
      referrerStub.value("http://smashbangpow.dk");
      asa(WebEvent.page.viewed, {
        location: window.location.href,
        title: document.title
      });
      asa(WebEvent.as.web.product.searched, {});

      locationStub.value("http://fle.com/place");
      referrerStub.value("");

      emptyEvents();

      const tab2 = getNewTab();
      tab2(WebEvent.page.viewed);
      tab2(WebEvent.as.web.product.searched);
      const event = findEvent(WebEvent.as.web.product.searched);

      expect(event).to.be.ok;
      expect(event.campaign).to.be.undefined;
      expect(event.page.referrer).to.be.undefined;
    });

    it("campaign info should persist through following steps on a site", () => {
      locationStub.value(
        "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
      );
      referrerStub.value("http://smashbangpow.dk");
      asa("service.providers.provided", "http://paymentgw.gw");
      asa(WebEvent.page.viewed, {
        location: window.location.href,
        title: document.title
      });
      asa(WebEvent.as.web.product.searched, {});

      locationStub.value("http://fle.com/place2");
      referrerStub.value("http://fle.com/place");
      emptyEvents();
      asa(WebEvent.page.viewed, {
        location: window.location.href,
        title: document.title
      });
      asa(WebEvent.as.web.product.searched, {});

      const event = findEvent(WebEvent.as.web.product.searched);
      expect(event).to.be.ok;
      expect(event.campaign.campaign).to.equals("testCampaign");
      expect(event.campaign.source).to.equals("testSource");
      expect(event.page.referrer).to.equals("http://smashbangpow.dk");
    });

    it("campaign info should persist through jumps over service provider", () => {
      locationStub.value(
        "http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource"
      );
      referrerStub.value("http://smashbangpow.dk");
      asa("service.providers.provided", "http://paymentgw.gw");
      asa(WebEvent.page.viewed, {
        location: window.location.href,
        title: document.title
      });
      asa(WebEvent.as.web.product.searched, {});

      locationStub.value("http://fle.com/place2");
      referrerStub.value("http://fle.com/place");
      asa("service.providers.provided", "http://paymentgw.gw");
      asa(WebEvent.page.viewed, {});
      asa(WebEvent.as.web.product.searched, {});

      locationStub.value("http://fle.com/place3");
      referrerStub.value("http://paymentgw.gw");

      emptyEvents();
      asa("service.providers.provided", "http://paymentgw.gw");
      asa(WebEvent.page.viewed, {});
      asa(WebEvent.as.web.product.searched, {});

      const event = findEvent(WebEvent.as.web.product.searched);
      expect(event).to.be.ok;
      expect(event.campaign.campaign).to.equals("testCampaign");
      expect(event.campaign.source).to.equals("testSource");
      expect(event.page.referrer).to.equals("http://smashbangpow.dk");
    });

    // it('Crossdomain Partner and Session', function() {
    //     browser.document = {
    //         location: 'http://siteb.com/?buybekbea=aavekwwe&__asa=AS-E2EAUTOTEST%7C52770730.451c571a6556a2c69671b901430db663330b64ab&someotherparam=bla',
    //         referrerStub('http://sitea.com',
    //    };
    //     partners.setPartnerInfo();
    //     asa('service.providers.provided', 'http://siteb.com/?buybekbea=aavekwwe&__asa=AS-E2EAUTOTEST%7C52770730.451c571a6556a2c69671b901430db663330b64ab&someotherparam=bla');
    //     asa('page.viewed');
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
