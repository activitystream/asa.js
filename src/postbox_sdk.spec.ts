import sinon from "sinon";
import Inbox from "./inbox";
import { expect } from "chai";
import core from "./server";
import * as info from "./version";
import * as features from "./features";
import * as session from "./session";
import { WebEvent } from "./event";

const _fetch = window.fetch;

export default describe("Postbox SDK", () => {
  let fetch;
  let asa;

  const adjustSystemInfo = ev => {
    const element = ev.ev;
    if (element.user.uid) element.user.uid = "user_id";
    if (element.user.did) element.user.did = "device_id";
    if (element.user.sid) element.user.sid = "session_id";
    if (element.occurred) element.occurred = "time";
    if (element.v) delete element.v;
    if (element.tenant) delete element.tenant;
    return ev;
  };

  before(() => {
    fetch = sinon.stub(window, "fetch");
  });

  beforeEach(() => {
    features.clearExperiments();
    asa = new Inbox();
  });

  after(() => {
    fetch.restore();
  });

  describe("product viewed", () => {
    it("sending data generates a complete message", done => {
      const expectation = {
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
      };

      fetch.callsFake((url, options) => {
        const body = JSON.parse(options.body);
        if (body.ev.type === expectation.type) {
          expect(adjustSystemInfo(body).ev).to.eql(expectation);
          done();
        }
        return _fetch(url, options);
      });

      asa(WebEvent.as.web.product.viewed, {
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
