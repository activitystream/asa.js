import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { storageAPI } from "../src/storage";
import { Dispatcher } from "../src/dispatcher";
import { URL } from "url";

// @ts-ignore
global.fetch = fetch;

const app = express.Router();

app.get("/asa.png", (req, res) => {
  const query = req.query as Query;
  if (!query.tenantId) {
    fs.createReadStream(path.resolve(__dirname, "./pixel.png")).pipe(res);
    return;
  }
  const storage = storageAPI();
  let locationString: string = req.get("Referrer") || "";
  if (!locationString) {
    locationString = "http://activitystreampixel.com";
  }
  const location = new URL(locationString);

  // Fill storage with campaign information from the url
  Object.keys(query).forEach(key => {
    if (key.startsWith("utm_")) {
      storage.setItem("__as." + key, query[key]);
    }
  });

  let referrer: URL | undefined = undefined;
  if (query.referrer) {
    try {
      referrer =
        query.referrer.startsWith("http://") ||
        query.referrer.startsWith("https://")
          ? new URL(query.referrer)
          : new URL(`http://${query.referrer}`);
      storage.setItem(
        "__asa_session",
        JSON.stringify({
          referrer
        })
      );
    } catch (error) {
      referrer = undefined;
    }
  }

  const dispatcher = Dispatcher({
    location,
    referrer,
    storage,
    title: req.query.title,
    pixelMetadata: { originalUrl: req.originalUrl }
  });

  dispatcher("set.session.events.enabled", false);

  dispatcher("set.tenant.id", query.tenantId);

  dispatcher("set.logger.mode", true);

  if (query.event === "as.web.payment.completed") {
    dispatcher(query.event, [query.order]);
  } else if (query.event === "as.web.product.viewed") {
    dispatcher(query.event, [query.product]);
  }

  fs.createReadStream(path.resolve(__dirname, "./pixel.png")).pipe(res);
});

interface BaseQuery extends UTMParameters {
  tenantId: string;
  referrer?: string;
}

interface PaymentCompletedQuery extends BaseQuery {
  event: "as.web.payment.completed";
  order: string;
}

interface ProductViewedQuery extends BaseQuery {
  event: "as.web.product.viewed";
  product: string;
}

interface UTMParameters {
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_content?: string;
  utm_term?: string;
}
type Query = PaymentCompletedQuery | ProductViewedQuery;

export default app;
