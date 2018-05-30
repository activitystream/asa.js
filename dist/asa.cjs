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

/**
 * @module campaign
 */
var UTM;
(function (UTM) {
    UTM[UTM["utm_campaign"] = 0] = "utm_campaign";
    UTM[UTM["utm_medium"] = 1] = "utm_medium";
    UTM[UTM["utm_source"] = 2] = "utm_source";
    UTM[UTM["utm_content"] = 3] = "utm_content";
    UTM[UTM["utm_term"] = 4] = "utm_term";
    UTM[UTM["length"] = 5] = "length";
})(UTM || (UTM = {}));
(function (UTM) {
    UTM.forEach = Array.prototype.forEach;
    UTM.map = Array.prototype.map;
})(UTM || (UTM = {}));
class Campaign {
    constructor(campaign, medium, source, content, term) {
        this.campaign = campaign;
        this.medium = medium;
        this.source = source;
        this.content = content;
        this.term = term;
    }
}
var getCampaign = () => {
    const referrer = Document.referrer && new URL(Document.referrer);
    const location = Document.location && new URL(Document.location);
    const campaign = UTM.map((key) => (referrer && referrer.searchParams.get(key)) ||
        (location && location.searchParams.get(key)) ||
        Window.sessionStorage.getItem(`__as.${key}`) ||
        undefined);
    return campaign.some(p => !!p) && new Campaign(...campaign);
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
const uid = () => Math.round(Math.random() * Date.now());
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
let hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(s)));
}
/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s) {
    return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}
/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input) {
    try {
    }
    catch (e) {
        hexcase = 0;
    }
    const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    let output = "";
    let x;
    for (let i = 0; i < input.length; i++) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0f) + hex_tab.charAt(x & 0x0f);
    }
    return output;
}
/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input) {
    let output = "";
    let i = -1;
    let x;
    let y;
    while (++i < input.length) {
        /* Decode utf-16 surrogate pairs */
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
            x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
            i++;
        }
        /* Encode output as utf-8 */
        if (x <= 0x7f)
            output += String.fromCharCode(x);
        else if (x <= 0x7ff)
            output += String.fromCharCode(0xc0 | ((x >>> 6) & 0x1f), 0x80 | (x & 0x3f));
        else if (x <= 0xffff)
            output += String.fromCharCode(0xe0 | ((x >>> 12) & 0x0f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
        else if (x <= 0x1fffff)
            output += String.fromCharCode(0xf0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
    }
    return output;
}
/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input) {
    const output = Array(input.length >> 2);
    for (let i = 0; i < output.length; i++)
        output[i] = 0;
    for (let i = 0; i < input.length * 8; i += 8)
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (24 - i % 32);
    return output;
}
/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input) {
    let output = "";
    for (let i = 0; i < input.length * 32; i += 8)
        output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xff);
    return output;
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[(((len + 64) >> 9) << 4) + 15] = len;
    const w = Array(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;
    for (let i = 0; i < x.length; i += 16) {
        const olda = a;
        const oldb = b;
        const oldc = c;
        const oldd = d;
        const olde = e;
        for (let j = 0; j < 80; j++) {
            if (j < 16)
                w[j] = x[i + j];
            else
                w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            const t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
    if (t < 20)
        return (b & c) | (~b & d);
    if (t < 40)
        return b ^ c ^ d;
    if (t < 60)
        return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
    return t < 20
        ? 1518500249
        : t < 40
            ? 1859775393
            : t < 60
                ? -1894007588
                : -899497514;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

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

/**
 * @module user
 */
const USER_ID_COOKIE = "__as_user";
const generateUser = () => `${getDomain()}.${hex_sha1(uid())}`;
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
const getDomain = () => hex_sha1(Window.location.host);

/**
 * @module session
 */
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
        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(Object.assign({}, data, { id: `${getDomain()}.${hex_sha1(`${getUser()}.${uid()}`)}`, t: new Date().getTime() + SESSION_EXPIRE_TIMEOUT })));
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

/**
 * @module logger
 */
// old ie
if (!console) {
    window.console = {};
}
if (!console.log) {
    window.console.log = () => { };
}
class Logger {
    constructor() {
        this._logger = Logger.none;
    }
    static none(...args) { }
    static console(...args) {
        console.log("js", ...args);
    }
    mode(mode) {
        this._logger = mode ? Logger.console : Logger.none;
    }
    log(...args) {
        this._logger(...args);
    }
    force(...args) {
        Logger.console(...args);
    }
}
var logger = new Logger();

/**
 * @module metadata
 */
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
            __items: [].map.call(el.children, processElement)
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
const extract = (selector) => {
    const elements = typeof selector === "string"
        ? document.querySelectorAll(selector)
        : selector;
    const data = [].map
        .call(elements, (el) => _mapper(processElement(el), el))
        .filter((data) => data);
    return data.length > 1
        ? {
            __items: data
        }
        : data.pop();
};

/**
 * @module tracking
 */
function track(domains) {
    const domainsTracked = domains;
    const tracker = ({ target }) => {
        let href = target.href;
        if (href) {
            const destination = new URL(href);
            if (~domainsTracked.indexOf(destination.host)) {
                destination.searchParams.set(PARTNER_ID_KEY, dispatcher.id);
                destination.searchParams.set(PARTNER_SID_KEY, proxy.getSession().asa.id);
                UTM.forEach((key) => {
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

var version = "1.1.77";

/**
 * @module event
 */
const DOMMeta = (selector) => selector &&
    (selector instanceof HTMLElement ||
        selector[0] instanceof HTMLElement ||
        typeof selector === "string")
    ? selector
    : false;
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
        if (dispatcher.id)
            this.tenant = dispatcher.id;
        if (partner_id)
            this.partner_id = partner_id;
        if (partner_sid)
            this.partner_sid = partner_sid;
        this.v = version;
    }
    toJSON() {
        return JSON.parse(JSON.stringify(Object.assign({}, this)));
    }
    [Symbol.toPrimitive]() {
        return this.type;
    }
}
var as;
(function (as) {
    var web;
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
                constructor(...data) {
                    super();
                    if (DOMMeta(data[0])) {
                        let meta = extract(data[0]);
                        if (meta && data[1])
                            meta = Object.assign({}, meta, data[1]);
                        if (meta)
                            this.meta = meta;
                    }
                    else {
                        this.meta = Object.assign({}, data[0], extractFromHead());
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
})(as || (as = {}));
const web = {
    "as.web.customer.account.provided": as.web.customer.account.provided,
    "as.web.order.reviewed": as.web.order.reviewed,
    "as.web.product.availability.checked": as.web.product.availability.checked,
    "as.web.product.carted": as.web.product.carted,
    "as.web.product.searched": as.web.product.searched,
    "as.web.product.shipping.selected": as.web.product.shipping.selected,
    "as.web.product.viewed": as.web.product.viewed,
    "as.web.payment.completed": as.web.payment.completed
};

/**
 * @module api
 */
const toDigits = (d, n) => ("0" + Math.abs(n)).slice(-d);
const stringifyDate = (date) => {
    const offset = -date.getTimezoneOffset();
    const local = new Date(date);
    local.setMinutes(date.getMinutes() + offset);
    return (local.toISOString().slice(0, -1) +
        (~Math.sign(offset) ? "+" : "-") +
        toDigits(2, offset / 60) +
        ":" +
        toDigits(2, offset % 60));
};
const POST = (url, data) => fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "text/plain; charset=UTF-8"
    }
});
const EVENT = (data) => POST("//inbox.activitystream.com/asa", data);
const ERROR = (data) => POST("//inbox.activitystream.com/asa/error", data);
const submitEvent = ev => EVENT({
    ev,
    t: stringifyDate(new Date())
});
const submitError = (err, context) => ERROR({ err, context, v: version });
class API {
    constructor() {
        this._dispatchEvent = submitEvent;
        this._dispatchError = submitError;
        this.pendingSubmission = [];
        this.done = true;
        this.submitEvent = event => {
            return this._dispatchEvent(event);
        };
        this.submitError = (error, context) => {
            return this._dispatchError(error, context);
        };
    }
    batchEvent(e) {
        this.pendingSubmission.push(e);
    }
    batchOn() {
        this.batchIntervalHandler = setInterval(() => {
            try {
                if (this.pendingSubmission.length > 0 && this.done) {
                    const batchSize = Math.min(this.pendingSubmission.length, 10);
                    const events = this.pendingSubmission.slice(0, batchSize);
                    this.done = false;
                    events.forEach(event => submitEvent(event)
                        .then(() => this.pendingSubmission.splice(0, events.length))
                        .catch(logger.log));
                }
            }
            catch (e) {
                logger.log("exception submitting", e);
            }
        }, 400);
    }
    batchOff() {
        if (!this.batchIntervalHandler) {
            logger.log("cannot batch off, it is not on");
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
var api = new API();

/**
 * @module dispatcher
 */
function Dispatcher(tenant) {
    proxy.destroySession();
    this.setTenant(tenant);
    this.setProviders([]);
    return function Dispatcher(name, ...data) {
        const getReferrer = () => {
            const referrer = Document.referrer && new URL(Document.referrer).host;
            const location = Document.location && new URL(Document.location).host;
            return referrer &&
                location &&
                referrer !== location &&
                !~this.providers.indexOf(referrer)
                ? referrer
                : null;
        };
        try {
            if (!web[name]) {
                if (local[name]) {
                    local[name].call(this, ...data);
                }
                return;
            }
            const campaign = getCampaign();
            const referrer = getReferrer();
            if (!proxy.hasSession()) {
                logger.log("no session, starting a new one");
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
                logger.log("session resumed");
            }
            api.submitEvent(new web[name](...data));
        }
        catch (error) {
            logger.force("inbox exception:", error);
            api.submitError(error, {
                location: "processing inbox message",
                arguments: [event, ...data]
            });
        }
        return Dispatcher.bind(this);
    }.bind(this);
}
Dispatcher.prototype = new class Dispatcher {
    setTenant(tenant) {
        this.id = tenant;
    }
    setProviders(providers) {
        this.providers = providers.map(provider => new URL(provider).host);
    }
}();
const local = {
    "custom.session.created": customSession,
    "connected.partners.provided": track,
    "service.providers.provided": Dispatcher.prototype.setProviders,
    "tenant.id.provided": Dispatcher.prototype.setTenant,
    "debug.mode.enabled": logger.mode,
    "metadata.transformer.provided": setMapper
};
var dispatcher = new Dispatcher();

const Window = {
    sessionStorage: window.sessionStorage,
    location: window.location,
    asa: dispatcher
};
const Document = {
    location: document.location,
    referrer: document.referrer
};

/**
 * @module partner
 */
const PARTNER_ID_KEY = "__as.partner_id";
const PARTNER_SID_KEY = "__as.partner_sid";
const updatePartnerInfo = () => {
    const uri = new URL(Window.location.href);
    let partnerId = uri.searchParams.get(PARTNER_ID_KEY);
    let partnerSId = uri.searchParams.get(PARTNER_SID_KEY);
    UTM.forEach(key => {
        const keyValue = decodeURIComponent(uri.searchParams.get(key) || "");
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
    const referrer = Document.referrer && new URL(Document.referrer).host;
    const currentHost = Document.location && new URL(Window.location.href).host;
    if (referrer !== currentHost) {
        updatePartnerInfo();
    }
};
const getID = () => Window.sessionStorage.getItem(PARTNER_ID_KEY);
const getSID = () => Window.sessionStorage.getItem(PARTNER_SID_KEY);

var boot = () => {
    try {
        const queue = (window.asa && window.asa["q"]) || [];
        window.asa = dispatcher;
        setPartnerInfo();
        queue.forEach((args) => dispatcher.apply(null, args));
    }
    catch (e) {
        logger.force("exception during init: ", e);
        api.submitError(e, { location: "boot script" });
    }
};

boot();
