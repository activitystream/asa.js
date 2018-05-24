import Inbox from "./inbox";
import sinon from "sinon";
import { expect } from "chai";
import core from "./server";
import * as info from "./version";
import * as features from "./features";
import { WebEvent } from "./event";
import server from "./server";
import * as session from "./session";
import * as user from "./user";
import * as browser from "./browser";
import { truncateSync } from "fs";

const submitEventStub = sinon.stub(server, "submitEvent");
const locationStub = sinon.stub(browser.document, "location");

export default describe("inbox", () => {
  let requests = [];
  let xhr;
  let asa;
  const lastRequest = ({
    keepTitle = false,
    keepSession = false,
    keepSessionEvents = false
  } = {}) => {
    return JSON.parse(
      JSON.stringify(
        requests
          .filter(r => keepSessionEvents || !~r.type.indexOf("session"))
          .map(r => {
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
      location: event.location || browser.window.location.href
    };
  };

  before(() => {
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

  describe("default page.viewed", () => {
    it("should sent session started", () => {
      asa(WebEvent.page.viewed);

      expect(requests.length).to.equal(2);
    });
    it("should be a POST with data describing the event", () => {
      asa(WebEvent.page.viewed);
      const expectation = adjustSystemInfo({
        type: "session.started",
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
          newBrowser: true
        },
        location: browser.window.location.href
      });

      const request = adjustSystemInfo(
        lastRequest({ keepSessionEvents: true, keepTitle: true })
      );
      expect(request).to.eql(expectation);
    });
  });

  describe("page.viewed with custom meta", () => {
    it("should be a POST with data describing the event", () => {
      asa(WebEvent.page.viewed, { a: "s" });

      const expectation = adjustSystemInfo({
        type: WebEvent.Type["page.viewed"],
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
    const role = (a?) => a;
    const commerce = (a?) => a;
    const HOSTED_AT = "HOSTED_AT";
    const PART_OF = "PART_OF";
    const MANUFACTURED_BY = "MANUFACTURED_BY";

    it("should send item carted event", () => {
      // variant 1
      asa(WebEvent.as.web.product.carted, {
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
      asa(WebEvent.as.web.product.carted, {
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

  describe("custom events", () => {
    it("should send no metadata when none specified", () => {
      asa(WebEvent.custom("custom_one"));

      const expectation = adjustSystemInfo({
        type: "custom",
        event: "custom_one"
      });

      expect(adjustSystemInfo(lastRequest())).to.eql(expectation);
    });
    it("should send metadata when client id specified as string", () => {
      asa(WebEvent.custom("custom_one"), "#offer1");

      const expectation = adjustSystemInfo({
        type: "custom",
        event: "custom_one",
        meta: {
          type: "http://schema.org/Offer",
          properties: {
            name: "Blend-O-Matic",
            price: "$19.95",
            reviews: {
              type: "http://schema.org/AggregateRating",
              properties: {
                ratingValue: "4",
                bestRating: "5",
                ratingCount: "25"
              }
            }
          }
        }
      });
      expect(adjustSystemInfo(lastRequest())).to.eql(expectation);
    });
    it("should send metadata when specified as DOM element", () => {
      asa(WebEvent.custom("custom_one"), document.querySelectorAll("#offer1"));

      const expectation = adjustSystemInfo({
        type: "custom",
        event: "custom_one",
        meta: {
          type: "http://schema.org/Offer",
          properties: {
            name: "Blend-O-Matic",
            price: "$19.95",
            reviews: {
              type: "http://schema.org/AggregateRating",
              properties: {
                ratingValue: "4",
                bestRating: "5",
                ratingCount: "25"
              }
            }
          }
        }
      });

      expect(adjustSystemInfo(lastRequest())).to.eql(expectation);
    });
    it("should send metadata when specified as explicit extra one", () => {
      asa(WebEvent.custom("custom_one"), { a: "s" });

      const expectation = adjustSystemInfo({
        type: "custom",
        event: "custom_one",
        meta: { a: "s" }
      });

      expect(adjustSystemInfo(lastRequest())).to.eql(expectation);
    });
    it("should send metadata when specified as DOM element and extra metadata", () => {
      asa(WebEvent.custom("custom_one"), document.querySelectorAll("#offer1"), {
        a: "s"
      });

      const expectation = adjustSystemInfo({
        type: "custom",
        event: "custom_one",
        meta: {
          a: "s",
          type: "http://schema.org/Offer",
          properties: {
            name: "Blend-O-Matic",
            price: "$19.95",
            reviews: {
              type: "http://schema.org/AggregateRating",
              properties: {
                ratingValue: "4",
                bestRating: "5",
                ratingCount: "25"
              }
            }
          }
        }
      });

      expect(adjustSystemInfo(lastRequest())).to.eql(expectation);
    });
    it("should send metadata when specified as DOM element ID and extra metadata", () => {
      asa(WebEvent.custom("custom_one"), "#offer1", { a: "s" });

      const expectation = adjustSystemInfo({
        type: "custom",
        event: "custom_one",
        meta: {
          a: "s",
          type: "http://schema.org/Offer",
          properties: {
            name: "Blend-O-Matic",
            price: "$19.95",
            reviews: {
              type: "http://schema.org/AggregateRating",
              properties: {
                ratingValue: "4",
                bestRating: "5",
                ratingCount: "25"
              }
            }
          }
        }
      });

      expect(
        adjustSystemInfo(
          lastRequest({ keepSessionEvents: false, keepTitle: true })
        )
      ).to.eql(expectation);
    });
  });

  describe("campaign info", () => {
    it("should be present when session starts", () => {
      // for this test to work we should modify the url like this for now: /test.html?utm_campaign=testCampaign
      locationStub.value(
        window.location.origin +
          "/test.html?utm_campaign=testCampaign&utm_source=testSource"
      );
      asa(WebEvent.page.viewed);
      const expectation = adjustSystemInfo({
        type: WebEvent.Type["session.started"],
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
            "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter",
          newBrowser: true
        }
      });

      const request = adjustSystemInfo(
        lastRequest({
          keepSessionEvents: true
        })
      );
      console.log(request, expectation);
      expect(request).to.eql(expectation);
    });
  });

  describe("experiment miniAjax", () => {
    it("should be a POST with data describing the event", () => {
      features.defineExperiment(features.MINI_AJAX, 100);
      asa(WebEvent.page.viewed);

      const expectation = adjustSystemInfo({
        type: WebEvent.Type["session.started"],
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
          newBrowser: true
        }
      });

      expect(
        adjustSystemInfo(
          lastRequest({ keepTitle: false, keepSessionEvents: true })
        )
      ).to.eql(expectation);
    });
  });

  xdescribe("batching - the implementation is shitty", () => {
    it("should have both events", done => {
      core.batchOn();
      const batchingInbox = new Inbox();
      batchingInbox.transport = data => {
        core.batchEvent(data);
        return batchingInbox;
      };
      batchingInbox(WebEvent.page.viewed, { a: "s" });
      batchingInbox(WebEvent.page.viewed, { a: "d" });

      setTimeout(() => {
        core.batchOff();
        // var secondLastExpectation = adjustSystemInfo({ "ev": { "type": WebEvent.page.viewed, "page": "/test.html", "location": "sadfs", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "keywords": "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter", "a": "s" } } });
        const lastExpectation = adjustSystemInfo({
          ev: {
            type: WebEvent.page.viewed,
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

        const lr = lastRequest();
        expect(lastRequest()).to.eql(lastExpectation);
        // expect(secondLastRequest()).to.eql(secondLastExpectation);
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
      asa(WebEvent.page.viewed);

      expect(
        lastRequest({ keepSession: true, keepSessionEvents: true }).user.sid
      ).to.equal("my_session");
    });
  });
});
