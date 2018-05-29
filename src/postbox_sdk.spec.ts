import sinon from "sinon";
import { Dispatcher } from "./dispatcher";
import { expect } from "chai";
import { AsaEvent } from "./event";

const DATE: Date = new Date();

const _fetch = window.fetch;

export default describe("Postbox SDK", () => {
  let fetchStub: sinon.SinonStub;
  let asa: Dispatcher = new Dispatcher();

  const adjustSystemInfo = (data: {}): AsaEvent.Event => {
    const event: AsaEvent.Event = { ...data } as AsaEvent.Event;
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
      const expectation: AsaEvent.Event = adjustSystemInfo({
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
          product: {
            description: "SATURDAY NIGHT FEVER - THE MUSICAL",
            type: "Event",
            id: "1-4034344",
            product_variant: "Floor",
            price_category: "A",
            item_price: "222",
            currency: "DKK",
            categories: ["Teater", "Musical"]
          }
        }
      });

      fetchStub.callsFake((input: RequestInfo, init: RequestInit): Promise<
        Response
      > => {
        const body = JSON.parse(init.body as string);
        if (body.err) {
          return;
        }
        const event: AsaEvent.Event = adjustSystemInfo(body.ev);
        if (event.type === expectation.type) {
          expect(event).to.eql(expectation);
          done();
        }
        return _fetch(input, init);
      });

      asa("as.web.product.viewed", {
        product: {
          description: "SATURDAY NIGHT FEVER - THE MUSICAL",
          type: "Event",
          id: "1-4034344",
          product_variant: "Floor",
          price_category: "A",
          item_price: "222",
          currency: "DKK",
          categories: ["Teater", "Musical"]
        }
      });
    });
  });
});
