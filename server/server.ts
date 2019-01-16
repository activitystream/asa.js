import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import pixel from "./pixel";

const app = express();

app.use(cors());

app.use(pixel);

app.get("/", (req, res) => {
  fs.createReadStream(path.resolve(__dirname, "./test.html")).pipe(res);
});

app.use(express.static(path.resolve(__dirname, "../dist")));

export default app;
