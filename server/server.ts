import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { storageAPI } from "../src/storage";
import { Dispatcher } from "../src/dispatcher";
import { URL } from "whatwg-url";

const app = express();

app.use(cors());

app.get("/asa.png", (req, res) => {
  fs.createReadStream(path.resolve(__dirname, "./pixel.png")).pipe(res);
  const query = req.query as Query;
  let locationString: string = req.get("Referrer") as string;
  if (!locationString) {
    locationString = "http://activitystreampixel.com";
  }
  const location = (new URL(
    locationString
  ) as any) as Window["URL"]["prototype"];

  const dispatcher = Dispatcher({
    location,
    referrer: undefined,
    storage: storageAPI(),
    title: req.query.title
  });

  dispatcher("set.tenant.id", query.tenantId);

  if (query.event === "as.web.payment.completed") {
    dispatcher(query.event, [query.order]);
  } else if (query.event === "as.web.product.viewed") {
    dispatcher(query.event, [query.product]);
  }
});

app.get("/", (req, res) => {
  console.log("serving index.html");
  fs.createReadStream(path.resolve(__dirname, "./test.html")).pipe(res);
});

app.listen(8000, () => {
  console.log("ASA pixel server started");
});

interface BaseQuery {
  tenantId: string;
}

interface PaymentCompletedQuery extends BaseQuery {
  event: "as.web.payment.completed";
  order: string;
}

interface ProductViewedQuery extends BaseQuery {
  event: "as.web.product.viewed";
  product: string;
}

type Query = PaymentCompletedQuery | ProductViewedQuery;
