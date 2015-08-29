var CookieParser = require('restify-cookies');
var p = require('./package.json');
var restify = require('restify');

var port = process.env.PORT || 6502;

var server = restify.createServer();

server.name = p.name + ' server';
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(CookieParser.parse);
server.use(restify.CORS());

var eventLog = [];
server.post('/asa', function(req, res){
    var event;
    if (req.is('json')) {
        event = req.params;
    }
    if (req.is('text/plain')){
        event = JSON.parse(req.body);
    }
    
	console.log('event:',event);
    eventLog.push(event);
	res.send(200);
});

server.get('/log', function(req, res){
	res.send(eventLog);
});
server.del('/log', function(req, res){
    eventLog = [];
	res.send(200);
});

server.listen(port, function() {
    console.log('starting '+ server.name + 'on port '+port);
});
