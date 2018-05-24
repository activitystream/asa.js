var CookieParser = require("restify-cookies");
var p = require("./package.json");
var { plugins, createServer } = require("restify");

var port = process.env.PORT || 8088;

var server = createServer();

server.name = p.name + " server";
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
server.use(CookieParser.parse);

server.get(
  "/:(\\.*)",
  plugins.serveStatic({
    directory: "node_modules/@activitystream/asa/dist"
  })
);

server.listen(port, function() {
  console.log("starting " + server.name + "on port " + port);
});
