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
  };
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

var debugLog  = function debugLog(log) {
    if (options.logLevel !== 'silent') {
        console.log(`Log contains ${JSON.stringify(log, null, 4)}`);
    }
    return log;
};
// before(function() {
    // var chaiAsPromised = require('chai-as-promised');

    // chai.Should();
    // chai.use(chaiAsPromised);
    // chaiAsPromised.transferPromiseness = client.transferPromiseness;
// });

describe('Check if sites exist', function () {
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

  it('should send pageview sitea', function (done) {
    browser
      .url('http://sitea.com')
      .then(getLogs())
      .then(debugLog, debugLog)
      .then(function(eventLogs){
        expect(eventLogs.length).to.equal(2);
      }).call(done);
  });

  it('should send pageview siteb', function (done) {
    browser
      .url('http://siteb.com/buy')
      .then(getLogs())
      .then(debugLog, debugLog)
      .then(function(eventLogs){
        expect(eventLogs.length).to.equal(2);
      }).call(done);
  });
});

describe('Testing sitea', function () {
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

    it('sitea submitForm', function (done) {
      browser
        .url('http://sitea.com')
        .submitForm('#_form_')
        .then(getLogs())
        .then(debugLog, debugLog)
        .then(function(eventLogs){
          expect(eventLogs.length).to.equal(2);
      }).call(done);
    });

    it('sitea click offer1', function (done) {
      browser
        .url('http://sitea.com')
        .click('#_offer1')
        .then(getLogs())
        .then(debugLog, debugLog)
        .then(function(eventLogs){
          //Expect 4 events, Session Started, Pageview, Session Resumed and itemview
          expect(eventLogs.length).to.equal(4);
      }).call(done);
    });

    it('sitea click twitter', function (done) {
      browser
        .url('http://sitea.com')
        .click('#_twitter')
        .then(getLogs())
        .then(debugLog, debugLog)
        .then(function(eventLogs){
          expect(eventLogs.length).to.equal(2);
      }).call(done);
    });

    it('sitea click link with no param', function (done) {
      browser
        .url('http://sitea.com')
        .click('#_link_no_param')
        .waitForExist('#site_b')
        .then(getLogs())
        .then(debugLog, debugLog)
        .then(function(eventLogs){
            var pageViewSiteB = eventLogs.filter(function(d) {
                return d && d.ev && (d.ev.type === 'pageview' && d.ev.tenant_id === 'AS-E2EAUTOTEST-B');
            });
            expect(pageViewSiteB.length && pageViewSiteB[0].ev.partner_id).to.equal('AS-E2EAUTOTEST-A');
            expect(eventLogs.length).to.equal(4);
      }).call(done);
    });

    it('sitea click link with param', function (done) {
      browser
        .url('http://sitea.com')
        .click('#_link_with_param')
        .waitForExist('#site_b')
        .then(getLogs())
        .then(debugLog, debugLog)
        .then(function(eventLogs){
            var pageViewSiteB = eventLogs.filter(function(d) {
                return d && d.ev && (d.ev.type === 'pageview' && d.ev.tenant_id === 'AS-E2EAUTOTEST-B');
            });
            expect(pageViewSiteB.length && pageViewSiteB[0].ev.partner_id).to.equal('AS-E2EAUTOTEST-A');
            expect(eventLogs.length).to.equal(4);
      }).call(done);
    });
});
