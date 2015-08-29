var webdriverio = require('webdriverio');
var superagent = require('superagent');
var net = require('net');

var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 4444;
var options = {
  desiredCapabilities: {
    browserName: 'firefox'
  },
  host: host,
  port: port,
  logLevel: 'silent'
};

function retry(done) {
  var socket = new net.Socket();
  socket.on('connect', function () {
    socket.end();
    done();
  });
  socket.on('error', function (err) {
    socket.end();
    setTimeout(function () { retry(done); }, 100);
  });
  socket.connect(port, host);
}

function getLogs(done){
  return function(){
      setTimeout(function(){
        superagent
        .get('http://inbox/log')
        .accept('json')
        .end(function (err, res) {
          if (err) throw err;
          console.log('logs:',res.body);
          done(err); 
        });
      }, 1000)
  }
}

describe('test 1', function () {
  var browser;
  beforeEach(function (done) {
    retry(function () {
      browser = webdriverio
        .remote(options)
        .init();
      done();
    });

  });

  afterEach(function () {
    browser.end();
  });

  it('should send pageview', function (done) {
    browser
      .url('http://sitea.com')
      .then(getLogs(done))
  });
});
