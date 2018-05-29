import { expect } from "chai";
import sinon from "sinon";
import * as browser from "./browser";
import * as features from "./features";
import { Inbox } from "./inbox";
import server from "./server";
import session from "./session";
import * as user from "./user";
import * as info from "./version";

const locationStub = sinon.stub(browser.document, "location");

export default describe("inbox", () => {
  let requests = [];
  let asa: Inbox;
  let submitEventStub: sinon.SinonStub;
  const lastRequest = ({ keepTitle = false, keepSession = false } = {}) => {
    return JSON.parse(
      JSON.stringify(
        requests.map(r => {
          if (!keepSession) delete r.session;
          if (!keepTitle) delete r.title;
          return r;
        })[0]
      )
    );
  };

  const adjustSystemInfo = ({
    origin = null,
    page = null,
    user = null,
    occurred = null,
    ...event
  }) => {
    return {
      ...event,
      v: info.version(),
      occurred: "time",
      origin: window.location.origin,
      user: {
        did: "device_id",
        sid: "session_id"
      },
      page: {
        url: window.location.href
      }
    };
  };

  before(() => {
    submitEventStub = sinon.stub(server, "submitEvent");
    submitEventStub.value(ev => {
      requests.push(ev);
    });
  });

  beforeEach(() => {
    user.clearUser();
    locationStub.restore();
    session.destroySession();
    features.clearExperiments();
    requests = [];
    asa = new Inbox();
  });

  after(() => {
    submitEventStub.restore();
  });

  describe("default as.web.product.viewed", () => {
    it("should be a POST with data describing the event", () => {
      asa("as.web.product.viewed");
      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",

        meta: {
          "og:description":
            "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.",
          "og:url": "http://operaen.no/",
          "og:title":
            "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett",
          "og:site_name": "Operaen.no",
          "og:type": "website",
          keywords:
            "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter"
        }
      });

      const request = adjustSystemInfo(lastRequest({ keepTitle: true }));
      expect(request).to.eql(expectation);
    });
  });

  describe("as.web.product.viewed with custom meta", () => {
    it("should be a POST with data describing the event", () => {
      asa("as.web.product.viewed", { a: "s" });

      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        meta: {
          "og:description":
            "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.",
          "og:url": "http://operaen.no/",
          "og:title":
            "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett",
          "og:site_name": "Operaen.no",
          "og:type": "website",
          keywords:
            "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter",
          a: "s"
        }
      });

      const request = adjustSystemInfo(lastRequest({ keepTitle: true }));
      expect(request).to.eql(expectation);
    });
  });

  xdescribe("commerce events catalog", () => {
    const entity = (a?) => a;
    const item = (a?) => a;
    const location = (a?) => a;
    const rel = (a?) => a;
    const commerce = (a?) => a;
    const HOSTED_AT = "HOSTED_AT";
    const PART_OF = "PART_OF";
    const MANUFACTURED_BY = "MANUFACTURED_BY";

    it("should send item carted event", () => {
      // variant 1
      asa("as.web.product.carted", {
        aspects: [
          commerce(
            item()
              .involves(
                "CARTED",
                entity("EvenDate/123123123").relations(
                  rel().link(
                    HOSTED_AT,
                    entity("Venue/Operaen").aspects(location("12323,34553434"))
                  ),
                  rel().link(PART_OF, "Event/Mads Langer"),
                  rel().link(MANUFACTURED_BY, "Performer/Mads Langer")
                )
              )
              .itemCount(2)
              .itemPrice(123.5)
              .currency("DKK")
          )
        ]
      });

      // variant 2
      asa("as.web.product.carted", {
        item: "EventDate/23423423",
        venue: "Venue/Operaen",
        producedBy: "Producer/Operaen",
        hostedAt: "Venue/Operaen",
        count: 2,
        title: "Mads Langer",
        price: 123.5,
        currency: "DKK"
      });
    });
  });

  describe("campaign info", () => {
    it("should be present when session starts", () => {
      // for this test to work we should modify the url like this for now: /test.html?utm_campaign=testCampaign
      locationStub.value(
        window.location.origin +
          "/test.html?utm_campaign=testCampaign&utm_source=testSource"
      );
      asa("as.web.product.viewed");
      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        campaign: { campaign: "testCampaign", source: "testSource" },
        meta: {
          "og:description":
            "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.",
          "og:url": "http://operaen.no/",
          "og:title":
            "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett",
          "og:site_name": "Operaen.no",
          "og:type": "website",
          keywords:
            "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter"
        }
      });

      const request = adjustSystemInfo(lastRequest());
      expect(request).to.eql(expectation);
    });
  });

  describe("experiment miniAjax", () => {
    it("should be a POST with data describing the event", () => {
      features.defineExperiment(features.MINI_AJAX, 100);
      asa("as.web.product.viewed");

      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        meta: {
          "og:description":
            "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.",
          "og:url": "http://operaen.no/",
          "og:title":
            "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett",
          "og:site_name": "Operaen.no",
          "og:type": "website",
          keywords:
            "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter"
        }
      });

      expect(adjustSystemInfo(lastRequest({ keepTitle: false }))).to.eql(
        expectation
      );
    });
  });

  xdescribe("batching - the implementation is shitty", () => {
    it("should have both events", done => {
      server.batchOn();
      const batchingInbox = new Inbox();
      batchingInbox.transport = data => {
        server.batchEvent(data);
        return batchingInbox;
      };
      batchingInbox("as.web.product.viewed", { a: "s" });
      batchingInbox("as.web.product.viewed", { a: "d" });

      setTimeout(() => {
        server.batchOff();
        // var secondLastExpectation = adjustSystemInfo({ "ev": { "type": "as.web.product.viewed", "page": "/test.html", "location": "sadfs", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "keywords": "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter", "a": "s" } } });
        const lastExpectation = adjustSystemInfo({
          ev: {
            type: "as.web.product.viewed",
            page: "/test.html",
            location: "sadfs",
            title:
              "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett",
            meta: {
              "og:description":
                "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.",
              "og:url": "http://operaen.no/",
              "og:title":
                "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett",
              "og:site_name": "Operaen.no",
              "og:type": "website",
              keywords:
                "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter",
              a: "d"
            }
          }
        });

        expect(lastRequest()).to.eql(lastExpectation);
        done();
      }, 700);
    });
  });

  describe("custom session management", () => {
    it("should allow devs to provide their own session id", () => {
      asa(
        "custom.session.created",
        () => false,
        () => ({
          id: "my_session"
        }),
        () => {}
      );
      asa("as.web.product.viewed");

      expect(lastRequest({ keepSession: true }).user.sid).to.equal(
        "my_session"
      );
    });
  });
});
