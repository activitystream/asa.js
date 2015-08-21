
/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter
  , debug = require('debug')('mocha-cloud')
  , Batch = require('batch')
  , wd = require('webdriverio');

/**
 * Expose `Cloud`.
 */

module.exports = Cloud;

/**
 * Initialize a cloud test with
 * project `name`, your saucelabs username / key.
 *
 * @param {String} name
 * @param {String} user
 * @param {String} key
 * @api public
 */

function Cloud(name, user, key, server, port) {
  this.name = name;
  this.user = user;
  this.key = key;
  this.browsers = [];
  this._url = 'http://localhost:3000/';
  this._tags = [];
  this.server = server || 'localhost';
  this.port = port || 4444;
}

/**
 * Inherits from `Emitter.prototype`.
 */

Cloud.prototype.__proto__ = Emitter.prototype;

/**
 * Set tags to `tags`.
 *
 * @param {Array} tags
 * @return {Cloud} self
 * @api public
 */

Cloud.prototype.tags = function (tags) {
  this._tags = tags;
  return this;
};

/**
 * Set test `url`.
 *
 * @param {String} url
 * @api public
 */

Cloud.prototype.url = function (url) {
  this._url = url;
  return this;
};

/**
 * Add browser for testing.
 *
 * View https://saucelabs.com/docs/browsers for details.
 *
 * @param {String} name
 * @param {String} version
 * @param {String} platform
 * @return {Cloud} self
 * @api public
 */

Cloud.prototype.browser = function (name, version, platform, device) {
  debug('add %s %s %s %s', name, version, platform, device);
  this.browsers.push({
    browserName: name,
    version: version,
    platform: platform,
    deviceName: device,
    id: function () {
      return this.browserName.trim() === '' ? this.browser.deviceName : this.browserName;
    }
  });
};

/**
 * Start cloud tests and invoke `fn(err, results)`.
 *
 * Emits:
 *
 *   - `init` (browser) testing initiated
 *   - `start` (browser) testing started
 *   - `end` (browser, results) test results complete
 *
 * @param {Function} fn
 * @api public
 */

Cloud.prototype.start = function (fn) {
  var self = this;
  var batch = new Batch;
  fn = fn || function () { };

  this.browsers.forEach(function (conf) {
    conf.tags = self.tags;
    conf.name = self.name;

    batch.push(function (done) {
      debug('running %s %s %s', conf.browserName, conf.version, conf.platform);
      var browser = wd.remote(
        {
          desiredCapabilities: {
            browserName: conf.browserName,
            version: conf.version,
            platform: conf.platform,
            device: conf.deviceName,
            tags: conf.tags,
            name: conf.name
          },
          host: self.server,
          port: self.port,
          user: self.user,
          key: self.key,
          logLevel: 'silent'
        });
      self.emit('init', conf);

      browser
        .init()
        .url(self._url)
        .then(function () {
          debug('opened %s', self._url);
          self.emit('started', conf);

          function wait() {
            browser
              .execute('return window.mochaResults;')
              .then(function (res, b) {
                debug('res %s', JSON.stringify(res.value));
                if (!res.value) {
                  debug('waiting for results');
                  setTimeout(wait, 1000);
                  return;
                }

                debug('results %j', res.value);
                self.emit('end', conf, res.value);
                browser.end();
                done(null, res);
              }, function (err) {
                browser.end();
                done(err);
              });
          }

          wait();
        })
    });
  });

  batch.end(fn);
};
