var CookieParser = require('restify-cookies');
var p = require('./package.json');
var restify = require('restify');

var port = process.env.PORT || 8088;

var server = restify.createServer();

server.name = p.name + ' server';
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(CookieParser.parse);


server.get(/\/?.*/, restify.serveStatic({
  directory: './site',
  default: 'index.html'
}));

server.listen(port, function() {
    console.log('starting '+ server.name + 'on port '+port);
});