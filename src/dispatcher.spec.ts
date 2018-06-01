import { expect } from "chai";
import sinon from "sinon";
import * as browser from "./browser";
import { Dispatcher } from "./dispatcher";
import api from "./api";
import { Event } from "./event";
import { destroySession } from "./session";
import * as user from "./user";
import { version } from "../package.json";

const locationStub = sinon.stub(browser.document, "location");
const getNewTab = () => {
  destroySession();
  return new Dispatcher()("set.tenant.id", "AS-E2EAUTOTEST-A");
};

export default describe("dispatcher", () => {
  let requests = [];
  let asa: Dispatcher;
  let submitEventStub: sinon.SinonStub;
  const getRequests = ({
    keepTitle = false,
    keepSession = false,
    keepSessionEvents = false
  } = {}) =>
    JSON.parse(
      JSON.stringify(
        requests
          .filter(
            (r: Event): boolean =>
              keepSessionEvents ||
              !~["as.web.session.started", "as.web.session.resumed"].indexOf(
                r.type as string
              )
          )
          .map((r: Event): Event => {
            if (!keepSession) delete r.session;
            if (!keepTitle) delete r.title;
            return r;
          })
      )
    );

  const adjustSystemInfo = ({
    origin = null,
    page = null,
    user = null,
    occurred = null,
    ...event
  }) => {
    return {
      ...event,
      v: version,
      location: "asdf",
      occurred: new Date("1997-01-01"),
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
    submitEventStub = sinon.stub(api, "submitEvent");
    submitEventStub.value(ev => {
      requests.push(ev);
    });
  });

  beforeEach(() => {
    user.clearUser();
    locationStub.restore();
    requests = [];
    asa = getNewTab();
  });

  after(() => {
    submitEventStub.restore();
  });

  describe("default as.web.session.started", function() {
    it("should send session started", function() {
      asa("as.web.product.viewed");

      expect(requests.length).to.equal(2);
    });
    it("should be a POST with data describing the event", function() {
      asa("as.web.product.viewed");
      var expectation = adjustSystemInfo({
        type: "as.web.session.started",
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
            "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter"
        }
      });

      var request = adjustSystemInfo(
        getRequests({
          keepSessionEvents: true,
          keepTitle: true
        })[0]
      );
      expect(request).to.eql(expectation);
    });
  });

  describe("pageview with custom meta", function() {
    xit("should be a POST with data describing the event", function() {
      asa("pageview", { a: "s" });

      var expectation = adjustSystemInfo({
        ev: {
          type: "custom",
          event: "sessionStarted",
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
            a: "s"
          }
        }
      });

      var request = getRequests({
        keepSessionEvents: true,
        keepTitle: true
      }).pop();
      expect(request).to.eql(expectation);
    });
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

      const request = adjustSystemInfo(getRequests({ keepTitle: true }).pop());
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

      const request = adjustSystemInfo(getRequests({ keepTitle: true }).pop());
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
      const asa = getNewTab();
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

      const request = adjustSystemInfo(getRequests().pop());
      expect(request).to.eql(expectation);
    });
  });

  describe("experiment miniAjax", () => {
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

      expect(adjustSystemInfo(getRequests({ keepTitle: false }).pop())).to.eql(
        expectation
      );
    });
  });

  xdescribe("batching - the implementation is shitty", () => {
    it("should have both events", done => {
      api.batchOn();
      const batchingDispatcher = new Dispatcher();
      batchingDispatcher.transport = data => {
        api.batchEvent(data);
        return batchingDispatcher;
      };
      batchingDispatcher("as.web.product.viewed", { a: "s" });
      batchingDispatcher("as.web.product.viewed", { a: "d" });

      setTimeout(() => {
        api.batchOff();
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

        expect(getRequests().pop()).to.eql(lastExpectation);
        done();
      }, 700);
    });
  });

  describe("custom session management", () => {
    it("should allow devs to provide their own session id", () => {
      asa(
        "create.custom.session",
        () => false,
        () => ({
          id: "my_session"
        }),
        () => {}
      );
      asa("as.web.product.viewed");

      expect(getRequests({ keepSession: true }).pop().user.sid).to.equal(
        "my_session"
      );
    });
  });
});
