const CookieParser = require("restify-cookies");
const p = require("./package.json");
const { plugins, createServer } = require("restify");
const CORS = require("restify-cors-middleware");

const port = process.env.PORT || 6502;

const server = createServer();
const cors = CORS({
  origins: ["*"]
});

server.name = p.name + " server";
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
server.use(CookieParser.parse);
server.pre(cors.preflight);
server.use(cors.actual);

let store = [];
server.post("/asa", function(req, res) {
  let event;
  if (req.is("json")) {
    event = req.params;
  }
  if (req.is("text/plain")) {
    event = JSON.parse(req.body);
  }
  event.server_time = new Date().getTime();
  event.useragent = req.header("user-agent");
  event.referrer = req.header("referer");
  event.client_ip = req.connection.remoteAddress;

  console.log("event:", event);
  store.push(event);
  res.send(200);
});

server.get("/log", function(req, res) {
  res.send(store);
});
server.del("/log", function(req, res) {
  store = [];
  res.send(200);
});

server.listen(port, function() {
  console.log("starting " + server.name + "on port " + port);
});
