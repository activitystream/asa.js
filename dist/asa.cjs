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

function Promise(fn) {
  if (!(this instanceof Promise))
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
  Promise._immediateFn(function() {
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
      if (newValue instanceof Promise) {
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
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
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

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = function(callback) {
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

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
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

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
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
  globalNS.Promise = Promise;
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

const Window = {
    sessionStorage: window.sessionStorage,
    location: window.location,
    set asa(instance) {
        window.asa = instance;
    },
    get asa() {
        return window.asa;
    }
};
const Document = {
    location: document.location,
    referrer: document.referrer
};

const { sessionStorage } = Window;
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
            sessionStorage.getItem(`__as.${curr}`);
        return value
            ? Object.assign({}, acc, { [curr]: value }) : acc;
    }, null);
    return (campaign &&
        new Campaign(campaign.utm_campaign, campaign.utm_medium, campaign.utm_source, campaign.utm_content, campaign.utm_term));
};

const PARTNER_ID_KEY = "__as.PARTNER_ID";
const PARTNER_SID_KEY = "__as.PARTNER_SID";
const updatePartnerInfo = () => {
    const uri = parser.parseURI(Window.location.href);
    const asaPartnerValue = decodeURIComponent(uri.queryKey.__asa || "").split("|");
    let partnerId;
    let partnerSId;
    if (asaPartnerValue) {
        partnerId = asaPartnerValue[0];
        partnerSId = asaPartnerValue[1];
    }
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

// old ie
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
const generateUserId = () => `${hash(Window.location.host)}.${hash(`${getNumber()}`)}`;
let userCreated = false;
const setUserId = () => Baker.setItem(USER_ID_COOKIE, generateUserId(), Infinity, "/");
const getUserId = () => {
    if (!Baker.getItem(USER_ID_COOKIE)) {
        userCreated = true;
        setUserId();
    }
    let userId = Baker.getItem(USER_ID_COOKIE);
    if (userId.length > 70 || userId.length < 40) {
        // we need proper migrations here
        setUserId();
        userId = Baker.getItem(USER_ID_COOKIE);
    }
    return userId;
};
const getDomainId = () => {
    return hash(Window.location.host);
};
const getAndResetNewUserStatus = () => {
    if (userCreated) {
        userCreated = false;
        return true;
    }
    else
        return false;
};

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

let experiments = {};
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

const major = 1;
const minor = 1;
const build = 77;
const version = () => [major, minor, build].join(".") +
    (experimentsLive() ? `-${experimentsLive()}` : "");

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
    ERROR({ err, context, v: version() });
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
    get submitEvent() {
        return this._dispatchEvent;
    }
    get submitError() {
        return this._dispatchError;
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

const copyProps = (o1, o2) => {
    for (const key in o2) {
        if (o2.hasOwnProperty(key) && o2[key] !== undefined) {
            o1[key] = o2[key];
        }
    }
};
const override = (o1, o2) => {
    if (!o1 && !o2)
        return undefined;
    if (!o1 && o2)
        return o2;
    if (o1 && !o2)
        return o1;
    const result = {};
    copyProps(result, o1);
    copyProps(result, o2);
    return result;
};

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
    remove: id => {
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
const builtinSessionManager = {
    hasSession() {
        const item = sessionStore.hasItem(SESSION_COOKIE_NAME);
        try {
            return item && JSON.parse(item).t > new Date();
        }
        catch (e) {
            return false;
        }
    },
    createSession(sessionData) {
        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(override(sessionData, {
            id: `${getDomainId()}.${hash(`${getUserId()}.${getNumber()}`)}`,
            t: new Date().getTime() + SESSION_EXPIRE_TIMEOUT
        })));
    },
    destroySession: () => sessionStore.removeItem(SESSION_COOKIE_NAME),
    getSession() {
        return JSON.parse(sessionStore.getItem(SESSION_COOKIE_NAME));
    },
    updateTimeout: function updateTimeout(sessionData) {
        let session = this.getSession();
        const sessionId = session.id;
        session = override(session, sessionData);
        session.t = new Date().getTime() + SESSION_EXPIRE_TIMEOUT;
        session.id = sessionId;
        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(session));
    }
};
const providedSessionManager = (hasSession, getSession, createSession, destroySession, updateTimeout) => ({
    hasSession,
    createSession,
    getSession,
    destroySession,
    updateTimeout
});
let sessionManager = builtinSessionManager;
const getSession = () => sessionManager.getSession();
const hasSession = () => !!sessionManager.hasSession();
const createSession = (sessionData) => sessionManager.createSession(sessionData);
const destroySession = () => sessionManager.destroySession();
const customSession = (hasSessions, getSession, createSession) => (sessionManager = providedSessionManager(hasSessions, getSession, createSession, destroySession, updateTimeout));
const updateTimeout = (sessionData) => sessionManager.updateTimeout(sessionData);

function links(domains) {
    const domainsTracked = domains;
    const tracker = ({ target }) => {
        let href = target.href;
        if (href) {
            const destination = parser.parseURI(href);
            if (domainsTracked.indexOf(destination.authority) > -1) {
                if (!destination.queryKey["__asa"]) {
                    const alreadyHasParams = target.href.indexOf("?") !== -1;
                    href = `${href +
                        (alreadyHasParams ? "&" : "?")}__asa=${encodeURIComponent(`${Window.asa.id}|${getSession().id}`)}`;
                    target.href = href;
                }
                const utmKeys = [
                    "utm_medium",
                    "utm_source",
                    "utm_campaign",
                    "utm_content",
                    "utm_term"
                ];
                const __as__campagin = {};
                utmKeys.forEach(utm_key => {
                    const utm_value = Window.sessionStorage.getItem(`__as.${utm_key}`);
                    if (utm_value) {
                        __as__campagin[utm_key] = utm_value;
                    }
                });
                if (Object.keys(__as__campagin).length) {
                    if (!Object.keys(destination.queryKey).some(key => key.indexOf("utm_") !== -1)) {
                        const hasParams = href.indexOf("?") !== -1;
                        Object.keys(__as__campagin).forEach((d, i) => {
                            href = `${href +
                                (!hasParams && i === 0 ? "?" : "&") +
                                d}=${encodeURIComponent(__as__campagin[d])}`;
                        });
                        target.href = href;
                    }
                }
            }
        }
    };
    document.addEventListener("mousedown", tracker);
    document.addEventListener("keyup", tracker);
    document.addEventListener("touchstart", tracker);
}

// const pageview = (event = {}) => {
//   const title = browser.document.title;
//   const location = browser.window.location.href;
//   return { type: "pageview", location, title, event };
// };
// const sectionentered = section => ({
//   type: "section_entered",
//   section
// });
// const custom = event => {
//   const baseEvent: any = pageview();
//   baseEvent.type = "custom";
//   baseEvent.event = event;
//   return baseEvent;
// };
// const gatherMetaInfo = function gatherMetaInfo(a) {
//   const event = a[0];
//   let eventBody: any = {};
//   if (event) {
//     switch (event.trim()) {
//       case "pageview":
//         eventBody = pageview(a);
//         break;
//       case "sectionentered":
//         eventBody = sectionentered(a);
//         break;
//       default:
//         eventBody = custom(a);
//     }
//     return eventBody;
//   }
//   throw new Error(
//     `Upsi! There is something wrong with this event: ${JSON.stringify(a)}`
//   );
// };
// const gatherSystemInfo = e => {
//   const sess = session.getSession();
//   e.t = formatting.formatDateTime(new Date());
//   e.session = sess.id;
//   e.referrer = sess.referrer || "";
//   const campaign = sess.campaign;
//   if (campaign) e.campaign = campaign;
//   e.uid = user.getUserId();
//   const partnerId = browser.window.sessionStorage.getItem("__as.partner_id");
//   const partnerSId = browser.window.sessionStorage.getItem("__as.partner_sid");
//   if (partnerId) {
//     e.partner_id = partnerId;
//   }
//   if (partnerSId) {
//     e.partner_sid = partnerSId;
//   }
//   e.tenant_id = browser.window.asa.id;
//   e.v = info.version();
//   return e;
// };
// export class Event {
//   public occurred: Date;
//   public origin: string;
//   public user: {
//     did: string;
//     sid: string;
//   };
//   public page: {
//     url: string;
//     referrer: string;
//   };
//   public v: string;
//   public campaign: string;
//   public tenant: string;
//   public partnerId: string;
//   public partnerSId: string;
//   constructor(public type: WebEvent.Type, data?, options?) {
//     const event = gatherSystemInfo(gatherMetaInfo([type, data, options]));
//     let meta: any = {};
//     if (type === WebEvent.Type["session.started"]) {
//       meta = microdata.extractFromHead();
//       if (typeof data === "object") {
//         meta = { ...meta, ...data };
//       }
//     } else if (type === WebEvent.Type["as.web.product.viewed"]) {
//       meta = DOMMeta([type, data, options]) || microdata.extract(data);
//     } else {
//       if (data && data.tagName) {
//         meta = microdata.extract(data);
//       } else {
//         meta = { ...meta, ...data };
//       }
//       meta = { ...meta, ...options };
//     }
//     if (meta) {
//       event.meta = meta;
//     }
//     this.occurred = event.t || meta.t;
//     this.origin = browser.window.location.host;
//     this.user = {
//       did: event.uid || meta.uid,
//       sid: event.session || meta.session
//     };
//     this.page = {
//       url: `${browser.window.location.protocol}//${
//         browser.window.location.host
//       }${browser.window.location.pathname}${browser.window.location.hash}${
//         browser.window.location.search
//       }`,
//       referrer: event.referrer
//     };
//     this.v = event.v || meta.v;
//     this.campaign = event.campaign || meta.campaign;
//     this.tenant = event.tenant_id || meta.tenant_id;
//     this.partnerId = event.partner_id || meta.partner_id;
//     this.partnerSId = event.partner_sid || meta.partner_sid;
//     Object.assign(this, data);
//   }
// }
var WebEvent;
(function (WebEvent_1) {
    let Type;
    (function (Type) {
        Type[Type["debug.mode.enabled"] = 0] = "debug.mode.enabled";
        Type[Type["page.viewed"] = 1] = "page.viewed";
        Type[Type["session.started"] = 2] = "session.started";
        Type[Type["session.resumed"] = 3] = "session.resumed";
        Type[Type["tenant.id.provided"] = 4] = "tenant.id.provided";
        Type[Type["custom.session.created"] = 5] = "custom.session.created";
        Type[Type["microdata.transformer.provided"] = 6] = "microdata.transformer.provided";
        Type[Type["connected.partners.provided"] = 7] = "connected.partners.provided";
        Type[Type["service.providers.provided"] = 8] = "service.providers.provided";
        Type[Type["as.web.customer.account.provided"] = 9] = "as.web.customer.account.provided";
        Type[Type["as.web.order.reviewed"] = 10] = "as.web.order.reviewed";
        Type[Type["as.web.product.availability.checked"] = 11] = "as.web.product.availability.checked";
        Type[Type["as.web.product.carted"] = 12] = "as.web.product.carted";
        Type[Type["as.web.product.searched"] = 13] = "as.web.product.searched";
        Type[Type["as.web.product.shipping.selected"] = 14] = "as.web.product.shipping.selected";
        Type[Type["as.web.product.viewed"] = 15] = "as.web.product.viewed";
        Type[Type["as.web.payment.completed"] = 16] = "as.web.payment.completed";
    })(Type = WebEvent_1.Type || (WebEvent_1.Type = {}));
    class WebEvent {
        constructor(type, data) {
            const { id, referrer, campaign } = getSession();
            const partner_id = getID();
            const partner_sid = getSID();
            this.origin = Window.location.origin;
            this.occurred = new Date();
            if (campaign)
                this.campaign = campaign;
            this.user = {
                did: getUserId(),
                sid: id
            };
            this.page = {
                url: Window.location.href
            };
            if (referrer)
                this.page.referrer = referrer;
            this.type = type;
            this.tenant_id = Window.asa.id;
            if (partner_id)
                this.partner_id = partner_id;
            if (partner_sid)
                this.partner_sid = partner_sid;
            this.title = document.title;
            this.location = Window.location.href;
            this.v = version();
            Object.assign(this, data);
        }
        toJSON() {
            return Object.assign({}, this, { type: Type[this.type] });
        }
    }
    WebEvent_1.WebEvent = WebEvent;
})(WebEvent || (WebEvent = {}));

var getReferrer = (location, referrer, serviceProviders) => {
    if (referrer && referrer.length > 0) {
        const referrerAuth = parser.parseURI(referrer).authority;
        const currentAuth = parser.parseURI(location).authority;
        if (referrerAuth != currentAuth &&
            serviceProviders.indexOf(referrerAuth) === -1) {
            return referrer;
        }
    }
    return null;
};

function Asa(tenant) {
    let serviceProviders = [];
    setPartnerInfo();
    const instance = function Asa(type, data, ...rest) {
        try {
            if (type === WebEvent.Type["custom.session.created"]) {
                customSession(data, rest[0], rest[1]);
                return;
            }
            if (type === WebEvent.Type["connected.partners.provided"]) {
                links(data);
                return;
            }
            if (type === WebEvent.Type["service.providers.provided"]) {
                serviceProviders = data;
                return;
            }
            if (type === WebEvent.Type["tenant.id.provided"]) {
                Window.asa.id = data;
                return;
            }
            if (type === WebEvent.Type["debug.mode.enabled"]) {
                setDebugMode(data);
                return;
            }
            if (type === WebEvent.Type["microdata.transformer.provided"]) {
                return;
            }
            const campaign = getCampaign();
            const referrer = getReferrer(Document.location, Document.referrer, serviceProviders);
            if (!hasSession()) {
                log("no session, starting a new one");
                createSession({ campaign, referrer });
                instance.transport(new WebEvent.WebEvent(WebEvent.Type["session.started"], {
                    newBrowser: getAndResetNewUserStatus()
                }));
            }
            else {
                const referrerAuth = parser.parseURI(Document.referrer).authority;
                const currentAuth = parser.parseURI(Document.location).authority;
                if (referrerAuth !== currentAuth &&
                    serviceProviders.indexOf(referrerAuth) === -1) {
                    updateTimeout({ campaign, referrer });
                    log("session resumed");
                    instance.transport(new WebEvent.WebEvent(WebEvent.Type["session.resumed"]));
                }
            }
            instance.transport(new WebEvent.WebEvent(type, data));
        }
        catch (e) {
            forceLog("inbox exception:", e);
            server.submitError(e, {
                location: "processing inbox message",
                arguments: [type, data, ...rest]
            });
        }
        return instance;
    };
    instance.id = tenant;
    instance.transport = data => {
        server.submitEvent(data);
        return instance;
    };
    return instance;
}

const runBootSequence = (bootSequence) => {
    bootSequence = bootSequence || [];
    if (!(bootSequence instanceof Array))
        bootSequence = [bootSequence];
    for (let i = 0; i < bootSequence.length; i++) {
        window.asa.apply(null, bootSequence[i]);
    }
};
var boot = (bootSequence = []) => {
    // if (DNT && (DNT === 'yes' || DNT.charAt(0) === '1')) return;
    try {
        const pendingEvents = (window.asa && window.asa.q) || [];
        window.asa = new Asa();
        window["WebEvent"] = WebEvent.Type;
        // features.defineExperiment(features.MINI_AJAX, 10);
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
