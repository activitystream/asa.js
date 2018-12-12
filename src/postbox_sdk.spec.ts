import sinon from "sinon";
import { Dispatcher } from "./dispatcher";

import { Event } from "./event";
import { deepEqual } from "./dispatcher.spec";

const DATE: Date = new Date();

const _fetch = window.fetch;

export default describe("Postbox SDK", () => {
  let fetchStub: sinon.SinonStub;
  let asa: Dispatcher = new Dispatcher();

  const adjustSystemInfo = (data: {}): Event => {
    const event: Event = { ...data } as Event;
    if (event.user.did) event.user.did = "device_id";
    if (event.user.sid) event.user.sid = "session_id";
    if (event.occurred) event.occurred = DATE;
    if (event.v) delete event.v;
    if (event.tenant) delete event.tenant;
    return event;
  };

  before(() => {
    fetchStub = sinon.stub(window, "fetch");
  });

  after(() => {
    fetchStub.restore();
  });

  describe("product viewed", () => {
    it("sending data generates a complete message", done => {
      const expectation: Event = adjustSystemInfo({
        type: "as.web.product.viewed",
        occurred: "time",
        origin: window.location.origin,
        user: {
          did: "device_id",
          sid: "session_id"
        },
        page: {
          url: window.location.href
        },
        products: ["Event/1-4034344"],
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

      fetchStub.callsFake(
        (input: RequestInfo, init: RequestInit): Promise<any> => {
          const requestBody = JSON.parse("" + init.body);
          console.log(requestBody);
          if (requestBody.err) {
            return Promise.reject(requestBody.err);
          }
          const event: Event = adjustSystemInfo(requestBody.ev);
          if (event.type === expectation.type) {
            deepEqual(expectation, event);
            done();
          }
          return Promise.resolve();
        }
      );

      asa("as.web.product.viewed", [
        {
          description: "SATURDAY NIGHT FEVER - THE MUSICAL",
          id: "Event/1-4034344",
          product_variant: "Floor",
          price_category: "A",
          item_price: "222",
          currency: "DKK",
          categories: ["Teater", "Musical"]
        }
      ]);
    });
  });
});
