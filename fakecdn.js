var restify = require('restify');
var port = process.env.PORT || 8080;

var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

server.post('/asa', function(req, res, next){
    console.log(JSON.stringify(req.body));
    return res.send(200);
});

server.get(/\/?.*/, restify.serveStatic({
  directory: './dist',
  default: 'index.html'
}));

server.listen(port, function() {
    console.log('starting '+ server.name + 'on port '+port);
});