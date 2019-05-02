jest.mock("../src/api", () => {
  return {
    submitEvent: jest.fn(),
    submitError: jest.fn()
  };
});

import pixel from "./server";
import request from "supertest";
import api from "../src/api";

describe("pixel", () => {
  it("Sends an event to inbox when the pixel is fetched", async () => {
    await request(pixel)
      .get(
        "/asa.png?tenantId=ASATEST&event=as.web.payment.completed&order=Order/1"
      )
      .set("Referrer", "http://ticketingsystem.com")
      .expect(200);

    expect(api.submitEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        origin: "http://ticketingsystem.com",
        page: {
          url: "http://ticketingsystem.com/"
        },
        orders: ["Order/1"],
        type: "as.web.payment.completed"
      })
    );
  });
  it("Gets campaign information from the Referrer field", async () => {
    await request(pixel)
      .get(
        "/asa.png?tenantId=ASATEST&event=as.web.payment.completed&order=Order/1"
      )
      .set("Referrer", "http://ticketingsystem.com?utm_campaign=my_campaign")
      .expect(200);

    expect(api.submitEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        campaign: { campaign: "my_campaign" },
        orders: ["Order/1"],
        type: "as.web.payment.completed"
      })
    );
  });
  it("Able to send refferrer information", async () => {
    await request(pixel)
      .get(
        "/asa.png?tenantId=ASATEST&event=as.web.payment.completed&order=Order/1&utm_campaign=my_campaign&referrer=astickets.com"
      )
      .set("Referrer", "http://ticketingsystem.com")
      .expect(200);

    expect(api.submitEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        campaign: { campaign: "my_campaign" },
        orders: ["Order/1"],
        type: "as.web.payment.completed",
        page: {
          referrer: "astickets.com",
          url: "http://ticketingsystem.com/"
        }
      })
    );

    await request(pixel)
      .get(
        "/asa.png?tenantId=ASATEST&event=as.web.payment.completed&order=Order/1&utm_campaign=my_campaign&referrer=http://astickets.com"
      )
      .set("Referrer", "http://ticketingsystem.com")
      .expect(200);

    expect(api.submitEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        campaign: { campaign: "my_campaign" },
        orders: ["Order/1"],
        type: "as.web.payment.completed",
        page: {
          referrer: "astickets.com",
          url: "http://ticketingsystem.com/"
        }
      })
    );

    await request(pixel)
      .get(
        "/asa.png?tenantId=ASATEST&event=as.web.payment.completed&order=Order/1&utm_campaign=my_campaign&referrer=https://astickets.com"
      )
      .set("Referrer", "http://ticketingsystem.com")
      .expect(200);

    expect(api.submitEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        campaign: { campaign: "my_campaign" },
        orders: ["Order/1"],
        type: "as.web.payment.completed",
        page: {
          referrer: "astickets.com",
          url: "http://ticketingsystem.com/"
        }
      })
    );
  });
  it("Gets campaign info from the query string", async () => {
    await request(pixel)
      .get(
        "/asa.png?tenantId=ASATEST&event=as.web.payment.completed&order=Order/1&utm_campaign=my_campaign"
      )
      .set("Referrer", "http://ticketingsystem.com")
      .expect(200);

    expect(api.submitEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        campaign: { campaign: "my_campaign" },
        orders: ["Order/1"],
        type: "as.web.payment.completed",
        pixelMetadata: {
          originalUrl:
            "/asa.png?tenantId=ASATEST&event=as.web.payment.completed&order=Order/1&utm_campaign=my_campaign"
        }
      })
    );
  });
  it("Doesn't error when tenantId is missing, but no event is sent", async () => {
    await request(pixel)
      .get("/asa.png?event=as.web.payment.completed&order=Order/1")
      .set("Referrer", "http://ticketingsystem.com")
      .expect(200);

    expect(api.submitEvent).not.toHaveBeenCalled();
  });
});
