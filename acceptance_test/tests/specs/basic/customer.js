var expect = require('chai').expect;
var webdriverio = require('webdriverio');
var superagent = require('superagent');
var net = require('net');
var chai = require('chai');
var q = require('q');

var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 4444;
var options = {
  desiredCapabilities: {
    browserName: 'firefox',
    version: '',
    platform: 'linux',
    // device: conf.deviceName,

  },
  host: host,
  port: port,
  user: 'pshomov',
  key: process.env.SAUCE_ACCESS_KEY,
  
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

function getLogs(){
  return function(){
        var deferred = q.defer();
        superagent
        .get('http://inbox/log')
        .accept('json')
        .end(function (err, res) {
          if (!err) {
            deferred.resolve(res.body);
          } else {
            deferred.reject(err);
          }
        });
        return deferred.promise;
  }
}

function wipeLogs(){
        var deferred = q.defer();
        superagent
        .del('http://inbox/log')
        .end(function (err, res) {
          if (!err) {
            deferred.resolve(res.body);
          } else {
            deferred.reject(err);
          }
        });
        return deferred.promise;
};
// before(function() {
    // var chaiAsPromised = require('chai-as-promised');

    // chai.Should();
    // chai.use(chaiAsPromised);
    // chaiAsPromised.transferPromiseness = client.transferPromiseness;
// });

describe('test 1', function () {
  var browser;
  beforeEach(function (done) {
    retry(function () {
      browser = webdriverio
        .remote(options)
        .init().then(wipeLogs);
      done();
    });

  });

  afterEach(function () {
    browser.end();
  });

  it('should send pageview', function (done) {
    browser
      .url('http://sitea.com')
      .then(getLogs())
      .then(function(eventLogs){
        expect(eventLogs.length).to.equal(1);
      }).call(done);
  });
});
