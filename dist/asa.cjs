'use strict';

require('whatwg-fetch');

var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

function Promise$1(fn) {
  if (!(this instanceof Promise$1))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise$1._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise$1) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise$1._immediateFn(function() {
      if (!self._handled) {
        Promise$1._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise$1.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise$1.prototype.then = function(onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise$1.prototype['finally'] = function(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
};

Promise$1.all = function(arr) {
  return new Promise$1(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise$1.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise$1) {
    return value;
  }

  return new Promise$1(function(resolve) {
    resolve(value);
  });
};

Promise$1.reject = function(value) {
  return new Promise$1(function(resolve, reject) {
    reject(value);
  });
};

Promise$1.race = function(values) {
  return new Promise$1(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise$1._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global$1 !== 'undefined') {
    return global$1;
  }
  throw new Error('unable to locate global object');
})();

if (!globalNS.Promise) {
  globalNS.Promise = Promise$1;
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        const subjectString = this.toString();
        if (typeof position !== "number" ||
            !isFinite(position) ||
            Math.floor(position) !== position ||
            position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        const lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
// Safari, in Private Browsing Mode, looks like it supports localStorage and sessionStorage but all calls to setItem
// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
// to avoid the entire page breaking, without having to do a check at each usage of Storage.
if (window.localStorage) {
    try {
        localStorage.localStorage = 1;
        delete localStorage.localStorage;
    }
    catch (e) {
        const storageAPI = () => {
            const store = {};
            return {
                setItem(prop, value) {
                    store[prop] = value;
                },
                getItem(prop) {
                    return store[prop];
                },
                removeItem(prop) {
                    delete store[prop];
                }
            };
        };
        const _localStorage = storageAPI();
        const _sessionStorage = storageAPI();
        Object.defineProperties(window, {
            localStorage: {
                get: () => _localStorage
            },
            sessionStorage: {
                get: () => _sessionStorage
            }
        });
    }
}

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
const PARSER = {
    STRICT: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    LOOSE: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
};
const defaults = {
    strictMode: false,
    key: [
        "source",
        "protocol",
        "authority",
        "userInfo",
        "user",
        "password",
        "host",
        "port",
        "relative",
        "path",
        "directory",
        "file",
        "query",
        "anchor"
    ],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: PARSER.LOOSE
};
class Parser {
    constructor(options = {}) {
        this.options = defaults;
        this.options = Object.assign({}, this.options, options);
    }
    getAuthority(str) {
        return this.parseURI(typeof str !== "string" ? str.href : str).authority;
    }
    parseURI(str) {
        const match = this.options.parser.exec(str);
        const uri = {};
        let i = 14;
        while (i--)
            uri[this.options.key[i]] = match[i] || "";
        uri[this.options.q.name] = {};
        uri[this.options.key[12]].replace(this.options.q.parser, ($0, $1, $2) => {
            if ($1)
                uri[this.options.q.name][$1] = $2;
        });
        return uri;
    }
}
var parser = new Parser();

class Campaign {
    constructor(campaign, medium, source, content, term) {
        this.campaign = campaign;
        this.medium = medium;
        this.source = source;
        this.content = content;
        this.term = term;
    }
}
const UTM = [
    "utm_medium",
    "utm_source",
    "utm_campaign",
    "utm_content",
    "utm_term"
];
var getCampaign = () => {
    const referrer = Document.referrer && new URL(Document.referrer);
    const location = Document.location && new URL(Document.location);
    const campaign = UTM.reduce((acc, curr) => {
        const value = (referrer && referrer.searchParams.get(curr)) ||
            (location && location.searchParams.get(curr)) ||
            Window.sessionStorage.getItem(`__as.${curr}`);
        return value
            ? Object.assign({}, acc, { [curr]: value }) : acc;
    }, null);
    return (campaign &&
        new Campaign(campaign.utm_campaign, campaign.utm_medium, campaign.utm_source, campaign.utm_content, campaign.utm_term));
};

// old ie
if (!console) {
    window.console = {};
}
if (!console.log) {
    window.console.log = () => { };
}
const noLog = (...args) => { };
const doLog = console.log.bind(console, "asa.js");
let _log = noLog;
const log = (...args) => _log(...args);
const setDebugMode = on => {
    _log = on ? doLog : noLog;
};
const forceLog = doLog;

const processElement = el => {
    if (el.hasAttribute("itemscope")) {
        let map = Array.prototype.reduce.call(el.children, (acc, curr) => (Object.assign({}, acc, { [curr.getAttribute("itemprop")]: processElement(curr) })), {});
        if (el.getAttribute("itemtype")) {
            map = {
                type: el.getAttribute("itemtype"),
                properties: map
            };
        }
        return map;
    }
    else if (el.hasAttribute("itemprop")) {
        return el.getAttribute("content") || el.innerText || el.src;
    }
    else {
        return {
            __items: Array.prototype.map.call(el.children, processElement)
        };
    }
};
const extractFromHead = () => _mapper(Array.prototype.reduce.call(document.querySelectorAll('head > meta[property^="og:"]'), (acc, curr) => (Object.assign({}, acc, { [curr.getAttribute("property")]: curr.getAttribute("content") })), {
    keywords: document.querySelector('head > meta[name="keywords"]') &&
        document
            .querySelector('head > meta[name="keywords"]')
            .getAttribute("content")
}));
const noMapper = (m, n) => m;
let _mapper = noMapper;
const setMapper = mapper => {
    _mapper = (meta, el) => {
        try {
            return mapper(meta, el);
        }
        catch (e) {
            return meta;
        }
    };
};
const extract = selector => {
    const elements = typeof selector === "string"
        ? document.querySelectorAll(selector)
        : selector;
    const data = Array.prototype.map
        .call(elements, el => _mapper(processElement(el), el))
        .filter(d => d);
    return data.length > 1
        ? {
            __items: data
        }
        : data.pop();
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

const hash = d => {
    let a = 1;
    let c = 0;
    let h;
    let o;
    if (d) {
        a = 0;
        for (h = d["length"] - 1; h >= 0; h--) {
            o = d.charCodeAt(h);
            a = ((a << 6) & 268435455) + o + (o << 14);
            c = a & 266338304;
            a = c != 0 ? a ^ (c >> 21) : a;
        }
    }
    return a;
};
/* jshint ignore:end */

const getNumber = () => Math.round(Math.random() * Date.now());

/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  Revision #3 - July 13th, 2017
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|  https://github.com/madmurphy/cookies.js
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path[, domain]])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/
var Baker = {
    getItem(sKey) {
        if (!sKey) {
            return null;
        }
        return (decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&")}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1")) || null);
    },
    setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        let sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires =
                        vEnd === Infinity
                            ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
                            : `; max-age=${vEnd}`;
                    /*
                      Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
                      version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
                      the end parameter might not work as expected. A possible solution might be to convert the the
                      relative time to an absolute time. For instance, replacing the previous line with:
                      */
                    /*
                      sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
                      */
                    break;
                case String:
                    sExpires = `; expires=${vEnd}`;
                    break;
                case Date:
                    sExpires = `; expires=${vEnd.toUTCString()}`;
                    break;
            }
        }
        document.cookie = `${encodeURIComponent(sKey)}=${encodeURIComponent(sValue)}${sExpires}${sDomain ? `; domain=${sDomain}` : ""}${sPath ? `; path=${sPath}` : ""}${bSecure ? "; secure" : ""}`;
        return true;
    },
    removeItem(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = `${encodeURIComponent(sKey)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${sDomain ? `; domain=${sDomain}` : ""}${sPath ? `; path=${sPath}` : ""}`;
        return true;
    },
    hasItem(sKey) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        return new RegExp(`(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&")}\\s*\\=`).test(document.cookie);
    },
    keys() {
        const aKeys = document.cookie
            .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
            .split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

const USER_ID_COOKIE = "__as_user";
const generateUser = () => `${hash(Window.location.host)}.${hash(`${getNumber()}`)}`;
const setUser = () => {
    const id = generateUser();
    Baker.setItem(USER_ID_COOKIE, id, Infinity, "/");
    return id;
};
const getUser = () => {
    let user = Baker.getItem(USER_ID_COOKIE);
    // migrations
    if (!user || user.length > 70 || user.length < 40) {
        user = setUser();
    }
    return user;
};
const getDomain = () => hash(Window.location.host);
const getHash = () => hash(getUser().split(".")[1]);

const persistence = {
    get(id) {
        try {
            return Baker.getItem(id);
        }
        catch (e) {
            throw new Error(`Error while trying to get item from session cookie:${id}`);
        }
    },
    set(id, value) {
        try {
            return Baker.setItem(id, value, Infinity, "/");
        }
        catch (e) {
            throw new Error(`Error while trying to set item to session cookie: "${id}" <- ${value}`);
        }
    },
    remove: (id) => {
        try {
            Baker.removeItem(id);
        }
        catch (e) {
            throw new Error(`Error while trying to remove item from session cookie: "${id}`);
        }
    }
};
const store = {
    hasItem: persistence.get,
    getItem: persistence.get,
    setItem: persistence.set,
    removeItem: persistence.remove
};
const sessionStore = store;
const SESSION_EXPIRE_TIMEOUT = 30 * 60 * 1000;
const SESSION_COOKIE_NAME = "__asa_session";
class SessionManager {
    hasSession() {
        const item = sessionStore.getItem(SESSION_COOKIE_NAME);
        try {
            return !!(item && JSON.parse(item).t > new Date());
        }
        catch (e) {
            return false;
        }
    }
    createSession(data) {
        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(Object.assign({}, data, { id: `${getDomain()}.${hash(`${getUser()}.${getNumber()}`)}`, t: new Date().getTime() + SESSION_EXPIRE_TIMEOUT })));
    }
    destroySession() {
        return sessionStore.removeItem(SESSION_COOKIE_NAME);
    }
    getSession() {
        return JSON.parse(sessionStore.getItem(SESSION_COOKIE_NAME));
    }
    updateTimeout(_a = this.getSession()) {
        var { campaign, referrer } = _a, sessionData = __rest(_a, ["campaign", "referrer"]);
        const session = Object.assign({}, this.getSession(), sessionData, campaign && { campaign: campaign }, referrer && { referrer: referrer }, { t: new Date().getTime() + SESSION_EXPIRE_TIMEOUT });
        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(session));
    }
}
let sessionManager = new SessionManager();
const customSession = (hasSession, getSession, createSession) => {
    sessionManager = new class extends SessionManager {
        hasSession() {
            return hasSession();
        }
        getSession() {
            return getSession();
        }
        createSession(data) {
            createSession(data);
        }
    }();
};
const proxy = {
    getSession: () => sessionManager.getSession(),
    createSession: (data) => sessionManager.createSession(data),
    hasSession: () => sessionManager.hasSession(),
    updateTimeout: (data) => sessionManager.updateTimeout(data),
    destroySession: () => sessionManager.destroySession()
};

function links(domains) {
    const domainsTracked = domains;
    const tracker = ({ target }) => {
        let href = target.href;
        if (href) {
            const destination = new URL(href);
            if (~domainsTracked.indexOf(destination.host)) {
                destination.searchParams.set(PARTNER_ID_KEY, Window.asa.id);
                destination.searchParams.set(PARTNER_SID_KEY, proxy.getSession().id);
                UTM.forEach(key => {
                    const value = Window.sessionStorage.getItem(`__as.${key}`);
                    if (value) {
                        destination.searchParams.set(key, value);
                    }
                });
                target.href = destination.href;
            }
        }
    };
    document.addEventListener("mousedown", tracker);
    document.addEventListener("keyup", tracker);
    document.addEventListener("touchstart", tracker);
}

let experiments = {};
const defineExperiment = (name, percentage) => {
    if (typeof percentage === "boolean") {
        if (percentage)
            experiments[name] = percentage;
    }
    else
        experiments[name] = getHash() % 100 <= percentage;
};
const experimentsLive = () => {
    const result = [];
    for (const exp in experiments) {
        if (experiments.hasOwnProperty(exp)) {
            if (experiments[exp])
                result.push(exp);
        }
    }
    return result.join(".");
};
const MINI_AJAX = "miniAjax";

var name = "@activitystream/asa";
var version = "1.1.77";
var description = "Activity Stream Analytics data sumbission library";
var browser = "dist/asa.min.js";
var main = "dist/asa.cjs";
var module$1 = "dist/asa.es";
var repository = {"url":"git@github.com:activitystream/asa.js.git"};
var scripts = {"test":"rollup -c --environment TEST -w","build":"rollup -c --environment PRODUCTION","start":"rollup -c --environment DEVELOPMENT -w"};
var keywords = ["activitystream","analytics","realtime"];
var author = "Activitystream";
var license = "MIT";
var dependencies = {"promise-polyfill":"^7.1.2","whatwg-fetch":"^2.0.4"};
var devDependencies = {"@types/chai":"^4.1.2","@types/mocha":"^5.2.0","@types/sinon":"^4.3.3","@types/source-map-support":"^0.4.0","@types/whatwg-fetch":"0.0.33","chai":"^4.1.2","mocha":"^5.1.1","sinon":"^5.0.7","source-map-support":"^0.5.5","rollup":"^0.58.2","rollup-plugin-babel":"^3.0.4","rollup-plugin-commonjs":"^9.1.3","rollup-plugin-json":"^2.3.0","rollup-plugin-livereload":"^0.6.0","rollup-plugin-node-builtins":"^2.1.2","rollup-plugin-node-globals":"^1.2.1","rollup-plugin-node-resolve":"^3.3.0","rollup-plugin-serve":"^0.4.2","rollup-plugin-typescript2":"^0.13.0","rollup-plugin-uglify":"^3.0.0","typescript":"^2.8.3","babel-core":"^6.26.3","babel-preset-env":"^1.7.0"};
var pkg = {
	name: name,
	version: version,
	description: description,
	browser: browser,
	main: main,
	module: module$1,
	repository: repository,
	scripts: scripts,
	keywords: keywords,
	author: author,
	license: license,
	dependencies: dependencies,
	devDependencies: devDependencies,
	"private": true
};

const version$1 = () => pkg.version +
    (experimentsLive() ? `-${experimentsLive()}` : "");

const DOMMeta = (selector) => selector &&
    (selector instanceof HTMLElement ||
        selector[0] instanceof HTMLElement ||
        typeof selector === "string")
    ? selector
    : false;
var AsaEvent;
(function (AsaEvent) {
    class Event {
        constructor() {
            const { id, referrer, campaign } = proxy.getSession();
            const partner_id = getID();
            const partner_sid = getSID();
            this.origin = Window.location.origin;
            this.occurred = new Date();
            if (campaign)
                this.campaign = campaign;
            this.user = {
                did: getUser(),
                sid: id
            };
            this.page = {
                url: Window.location.href
            };
            if (referrer)
                this.page.referrer = referrer;
            if (inbox.id)
                this.tenant = inbox.id;
            if (partner_id)
                this.partner_id = partner_id;
            if (partner_sid)
                this.partner_sid = partner_sid;
            this.v = version$1();
        }
        toJSON() {
            return JSON.parse(JSON.stringify(Object.assign({}, this)));
        }
        [Symbol.toPrimitive]() {
            return this.type;
        }
    }
    AsaEvent.Event = Event;
    let as;
    (function (as) {
        let web;
        (function (web) {
            let order;
            (function (order) {
                class reviewed extends Event {
                    constructor() {
                        super(...arguments);
                        this.type = "as.web.order.reviewed";
                    }
                }
                order.reviewed = reviewed;
            })(order = web.order || (web.order = {}));
            let customer;
            (function (customer) {
                let account;
                (function (account) {
                    class provided extends Event {
                        constructor() {
                            super(...arguments);
                            this.type = "as.web.customer.account.provided";
                        }
                    }
                    account.provided = provided;
                })(account = customer.account || (customer.account = {}));
            })(customer = web.customer || (web.customer = {}));
            let product;
            (function (product_1) {
                class product extends Event {
                    constructor(data) {
                        super();
                        if (DOMMeta(data)) {
                            const meta = extract(data);
                            if (meta)
                                this.meta = meta;
                        }
                        else {
                            this.meta = Object.assign({}, data, extractFromHead());
                        }
                    }
                }
                product_1.product = product;
                let availability;
                (function (availability) {
                    class checked extends product {
                        constructor() {
                            super(...arguments);
                            this.type = "as.web.product.availability.checked";
                        }
                    }
                    availability.checked = checked;
                })(availability = product_1.availability || (product_1.availability = {}));
                class carted extends product {
                    constructor() {
                        super(...arguments);
                        this.type = "as.web.product.carted";
                    }
                }
                product_1.carted = carted;
                class searched extends product {
                    constructor() {
                        super(...arguments);
                        this.type = "as.web.product.searched";
                    }
                }
                product_1.searched = searched;
                let shipping;
                (function (shipping) {
                    class selected extends product {
                        constructor() {
                            super(...arguments);
                            this.type = "as.web.product.shipping.selected";
                        }
                    }
                    shipping.selected = selected;
                })(shipping = product_1.shipping || (product_1.shipping = {}));
                class viewed extends product {
                    constructor() {
                        super(...arguments);
                        this.type = "as.web.product.viewed";
                    }
                }
                product_1.viewed = viewed;
            })(product = web.product || (web.product = {}));
            let payment;
            (function (payment) {
                class completed extends Event {
                    constructor() {
                        super(...arguments);
                        this.type = "as.web.payment.completed";
                    }
                }
                payment.completed = completed;
            })(payment = web.payment || (web.payment = {}));
        })(web = as.web || (as.web = {}));
    })(as = AsaEvent.as || (AsaEvent.as = {}));
    AsaEvent.web = {
        "as.web.customer.account.provided": as.web.customer.account.provided,
        "as.web.order.reviewed": as.web.order.reviewed,
        "as.web.product.availability.checked": as.web.product.availability.checked,
        "as.web.product.carted": as.web.product.carted,
        "as.web.product.searched": as.web.product.searched,
        "as.web.product.shipping.selected": as.web.product.shipping.selected,
        "as.web.product.viewed": as.web.product.viewed,
        "as.web.payment.completed": as.web.payment.completed
    };
    AsaEvent.local = {
        "custom.session.created": customSession,
        "connected.partners.provided": function (domains) {
            links(domains);
        },
        "service.providers.provided": function (providers) {
            this.providers = providers.map(parser.getAuthority.bind(parser));
        },
        "tenant.id.provided": function (id) {
            this.id = id;
        },
        "debug.mode.enabled": function (on) {
            setDebugMode(on);
        },
        "microdata.transformer.provided": function (mapper) {
            setMapper(mapper);
        }
    };
})(AsaEvent || (AsaEvent = {}));

const formatDateTime = time => {
    const pad = number => {
        if (number < 10) {
            return `0${number}`;
        }
        return number;
    };
    const timezone = time => {
        const hours = pad(Math.abs(Math.floor(time / 60)));
        const minutes = pad(Math.abs(time % 60));
        const sign = time > 0 ? "-" : "+";
        return `${sign + hours}:${minutes}`;
    };
    return `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}T${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}.${(time.getMilliseconds() / 1000).toFixed(3).slice(2, 5)}${timezone(time.getTimezoneOffset())}`;
};

const POST = (url, data) => fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "text/plain; charset=UTF-8"
    }
});
const EVENT = data => POST("//inbox.activitystream.com/asa", data);
const ERROR = data => POST("//inbox.activitystream.com/asa/error", data);
const submitEvent = ev => EVENT({
    ev,
    t: formatDateTime(new Date())
});
const submitError = (err, context) => (err && (err.code === 22 || err.code === 18)) ||
    ERROR({ err, context, v: version$1() });
class Server {
    constructor() {
        this._dispatchEvent = submitEvent;
        this._dispatchError = submitError;
        this.pendingSubmission = [];
        this.done = true;
    }
    batchEvent(e) {
        this.pendingSubmission.push(e);
    }
    submitEvent(event) {
        return this._dispatchEvent(event);
    }
    submitError(error, data) {
        return this._dispatchError(error, data);
    }
    batchOn() {
        this.batchIntervalHandler = setInterval(() => {
            try {
                if (this.pendingSubmission.length > 0 && this.done) {
                    const batchSize = Math.min(this.pendingSubmission.length, 10);
                    const event = this.pendingSubmission.slice(0, batchSize);
                    this.done = false;
                    submitEvent(event)
                        .then(() => this.pendingSubmission.splice(0, event.length))
                        .catch(log);
                }
            }
            catch (e) {
                log("exception submitting", e);
            }
        }, 400);
    }
    batchOff() {
        if (!this.batchIntervalHandler) {
            log("cannot batch off, it is not on");
        }
        else {
            clearInterval(this.batchIntervalHandler);
        }
    }
    override(eventDispatcher = this._dispatchEvent, errorDispatcher = this._dispatchError) {
        this._dispatchError = errorDispatcher;
        this._dispatchEvent = eventDispatcher;
    }
    reset() {
        this._dispatchError = submitError;
        this._dispatchEvent = submitEvent;
    }
}
var server = new Server();

function Inbox(tenant) {
    proxy.destroySession();
    const instance = function Inbox(name, ...data) {
        try {
            if (!AsaEvent.web[name]) {
                if (AsaEvent.local[name]) {
                    AsaEvent.local[name].call(instance, ...data);
                }
                return;
            }
            const campaign = getCampaign();
            const referrer = getReferrer();
            if (!proxy.hasSession()) {
                log("no session, starting a new one");
                proxy.createSession({
                    campaign,
                    referrer
                });
            }
            else if (referrer) {
                proxy.updateTimeout({
                    campaign,
                    referrer
                });
                log("session resumed");
            }
            instance.transport(new AsaEvent.web[name](...data));
        }
        catch (error) {
            forceLog("inbox exception:", error);
            server.submitError(error, {
                location: "processing inbox message",
                arguments: [event, ...data]
            });
        }
        return instance;
    };
    instance.id = tenant;
    instance.transport = (event) => {
        server.submitEvent(event);
    };
    instance.providers = [];
    const getReferrer = () => {
        const referrer = parser.getAuthority(Document.referrer);
        const location = parser.getAuthority(Document.location);
        return referrer &&
            referrer !== location &&
            !~instance.providers.indexOf(referrer)
            ? referrer
            : null;
    };
    return instance;
}
var inbox = new Inbox();

const Window = {
    sessionStorage: window.sessionStorage,
    location: window.location,
    asa: inbox
};
const Document = {
    location: document.location,
    referrer: document.referrer
};

const PARTNER_ID_KEY = "__as.partner_id";
const PARTNER_SID_KEY = "__as.partner_sid";
const updatePartnerInfo = () => {
    const uri = parser.parseURI(Window.location.href);
    let partnerId = uri.queryKey[PARTNER_ID_KEY];
    let partnerSId = uri.queryKey[PARTNER_SID_KEY];
    UTM.forEach(key => {
        const keyValue = decodeURIComponent(uri.queryKey[key] || "");
        if (keyValue) {
            Window.sessionStorage.setItem(`__as.${key}`, keyValue);
        }
        else {
            Window.sessionStorage.removeItem(`__as.${key}`);
        }
    });
    if (partnerId) {
        Window.sessionStorage.setItem(PARTNER_ID_KEY, partnerId);
    }
    else {
        Window.sessionStorage.removeItem(PARTNER_ID_KEY);
    }
    if (partnerSId) {
        Window.sessionStorage.setItem(PARTNER_SID_KEY, partnerSId);
    }
    else {
        Window.sessionStorage.removeItem(PARTNER_SID_KEY);
    }
};
const setPartnerInfo = () => {
    const referrer = parser.parseURI(Document.referrer).authority;
    const currentHost = parser.parseURI(Window.location.origin).authority;
    if (referrer !== currentHost) {
        updatePartnerInfo();
    }
};
const getID = () => Window.sessionStorage.getItem(PARTNER_ID_KEY);
const getSID = () => Window.sessionStorage.getItem(PARTNER_SID_KEY);

const runBootSequence = (bootSequence = []) => {
    if (!Array.isArray(bootSequence))
        bootSequence = [bootSequence];
    for (let i = 0; i < bootSequence.length; i++) {
        window.asa.apply(null, bootSequence[i]);
    }
};
var boot = (bootSequence = []) => {
    // if (DNT && (DNT === 'yes' || DNT.charAt(0) === '1')) return;
    try {
        const pendingEvents = (window.asa && window.asa["q"]) || [];
        window.asa = inbox;
        defineExperiment(MINI_AJAX, 10);
        setPartnerInfo();
        runBootSequence(bootSequence);
        for (let i = 0; i < pendingEvents.length; i++) {
            window.asa.apply(null, pendingEvents[i]);
        }
        // autoTrack.sections();
    }
    catch (e) {
        forceLog("exception during init: ", e);
        server.submitError(e, { location: "boot script" });
    }
};

boot();
