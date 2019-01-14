import sinon from "sinon";
import { Dispatcher } from "./dispatcher";

import { Event } from "./event";
import { deepEqual } from "./dispatcher.spec";
import { storageAPI } from "./storage";

const DATE: Date = new Date();

const _fetch = window.fetch;

export default describe("Postbox SDK", () => {
  let fetchStub: sinon.SinonStub;
  const attrs = {
    location: new URL(window.location.toString()),
    referrer: new URL(document.referrer || "http://example.com"),
    title: "",
    storage: storageAPI()
  };
  const asa = Dispatcher(attrs);
  asa("set.tenant.id", "TEST_TENANT");

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
        origin: attrs.location.origin,
        user: {
          did: "device_id",
          sid: "session_id"
        },
        page: {
          url: attrs.location.href
        },
        products: ["Event/1-4034344"]
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
          id: "Event/1-4034344"
        }
      ]);
    });
  });
});
