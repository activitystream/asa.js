import { expect } from "chai";
import sinon from "sinon";
import * as browser from "./browser";
import { Dispatcher } from "./dispatcher";
import api from "./api";
import { Event } from "./event";
import { version } from "../package.json";
import { storageAPI } from "./storage";

const locationStub = sinon.stub(browser.document, "location");
const getNewTab = () => {
  const dispatcher = Dispatcher({
    location: new URL(browser.document.location.toString()),
    referrer: document.referrer ? new URL(document.referrer) : undefined,
    storage: storageAPI(),
    title: document.title
  });
  dispatcher("set.tenant.id", "AS-E2EAUTOTEST-A");
  return dispatcher;
};

export default describe("dispatcher", () => {
  let requests: any[] = [];
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
          .map(
            (r: Event): Event => {
              if (!keepSession) delete r.session;
              if (!keepTitle) delete r.title;
              return r;
            }
          )
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
      partner_id: "",
      partner_sid: "",
      campaign: event.campaign || {},
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

  beforeEach(() => {
    submitEventStub = sinon.stub(api, "submitEvent");
    submitEventStub.value((ev: any) => {
      requests.push(ev);
    });
  });

  beforeEach(() => {
    locationStub.restore();
    requests = [];
    asa = getNewTab();
  });

  afterEach(() => {
    submitEventStub.restore();
  });

  describe("default as.web.session.started", function() {
    it("should send session started", function() {
      asa("as.web.product.viewed", ["Product/1"]);

      expect(requests.length).to.equal(2);
    });
    it("should be a POST with data describing the event", function() {
      asa("as.web.product.viewed", ["Product/1"]);
      var expectation = adjustSystemInfo({
        type: "as.web.session.started",
        location: "sadfs",
        tenant: "AS-E2EAUTOTEST-A",
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
      deepEqual(expectation, request);
    });
  });

  describe("default as.web.product.viewed", () => {
    it("should be a POST with data describing the event", () => {
      asa("as.web.product.viewed", ["Product/1"]);
      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        tenant: "AS-E2EAUTOTEST-A",
        products: ["Product/1"],
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
      deepEqual(expectation, request);
    });

    it("supports Product list as argument", () => {
      asa("as.web.product.viewed", [
        {
          id: "Product/1"
        }
      ]);

      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        tenant: "AS-E2EAUTOTEST-A",
        products: ["Product/1"],
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
      deepEqual(expectation, request);
    });

    it("supports product list with type as argument", () => {
      asa("as.web.product.viewed", [
        {
          type: "Product",
          id: "1"
        }
      ]);

      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        tenant: "AS-E2EAUTOTEST-A",
        products: ["Product/1"],
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
      deepEqual(expectation, request);
    });
  });

  describe("as.web.payment.completed", () => {
    it("supports a string list as an argument", () => {
      asa("as.web.payment.completed", ["Order/1"]);
      const expectation = adjustSystemInfo({
        type: "as.web.payment.completed",
        tenant: "AS-E2EAUTOTEST-A",
        orders: ["Order/1"],
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
      deepEqual(expectation, request);
    });

    it("supports a Order list as an argument", () => {
      asa("as.web.payment.completed", [{ id: "Order/1" }]);
      const expectation = adjustSystemInfo({
        type: "as.web.payment.completed",
        tenant: "AS-E2EAUTOTEST-A",
        orders: ["Order/1"],
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
      deepEqual(expectation, request);
    });

    it("supports a Order list with type as an argument", () => {
      asa("as.web.payment.completed", [{ type: "Order", id: "1" }]);
      const expectation = adjustSystemInfo({
        type: "as.web.payment.completed",
        tenant: "AS-E2EAUTOTEST-A",
        orders: ["Order/1"],
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
      deepEqual(expectation, request);
    });
  });

  describe("as.web.product.viewed with custom meta", () => {
    it("should be a POST with data describing the event", () => {
      asa("as.web.product.viewed", ["Product/1"]);

      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        tenant: "AS-E2EAUTOTEST-A",
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
      deepEqual(expectation, request);
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
      asa("as.web.product.viewed", ["Product/1"]);
      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        campaign: { campaign: "testCampaign", source: "testSource" },
        tenant: "AS-E2EAUTOTEST-A",
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
      deepEqual(expectation, request);
    });
  });

  describe("experiment miniAjax", () => {
    it("should be a POST with data describing the event", () => {
      asa("as.web.product.viewed", ["Product/1"]);

      const expectation = adjustSystemInfo({
        type: "as.web.product.viewed",
        tenant: "AS-E2EAUTOTEST-A",
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

      deepEqual(
        expectation,
        adjustSystemInfo(getRequests({ keepTitle: false }).pop())
      );
    });
  });

  describe("custom session management", () => {
    it("should allow devs to provide their own session id", () => {
      asa("create.custom.session", {
        createSession() {},
        refreshSession() {},
        destroySession() {},
        hasSession: () => false,
        getSession: () => ({
          id: "my_session",
          tenant: "",
          t: 0
        })
      });
      asa("as.web.product.viewed", ["Product/1"]);

      expect(getRequests({ keepSession: true }).pop().user.sid).to.equal(
        "my_session"
      );
    });
  });
});

export const deepEqual = (expect: any, actual: any) => {
  const keys1 = Object.keys(expect);
  for (const key of keys1) {
    let equals = false;
    if ({}.toString.call(expect[key]) === "[object Object]") {
      equals = deepEqual(expect[key], actual[key]);
    } else if (Array.isArray(expect[key])) {
      equals = deepEqual(expect[key], actual[key]);
    } else if ({}.toString.call(expect[key]) === "[object Date]") {
      equals = +expect[key] === +actual[key];
    } else {
      equals = expect[key] === actual[key];
    }
    if (!equals) {
      debugger;
      console.error("Expected", expect[key], " to equal ", actual[key]);
      console.error("Expected", expect, " to deeply equal ", actual);
      throw new Error("Expected" + expect + " to deeply equal " + actual);
    }
  }
  return true;
};
