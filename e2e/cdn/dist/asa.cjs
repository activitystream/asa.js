'use strict';

require('promise-polyfill/src/polyfill');
var whatwgUrl = require('whatwg-url');
require('whatwg-fetch');

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
if (!window.URL) {
    Object.defineProperties(window, {
        URL: {
            get: () => function URL(url) {
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor["searchParams"] = new whatwgUrl.URLSearchParams(anchor.search);
                return anchor;
            }
        }
    });
}

const Window = {
    sessionStorage: window.sessionStorage,
    location: window.location
};
const Document = {
    location: document.location,
    referrer: document.referrer
};

/**
 * @module campaign
 */
const UTM = {
    utm_campaign: ["utm_campaign"],
    utm_medium: ["utm_medium"],
    utm_source: ["utm_source"],
    utm_content: ["utm_content"],
    utm_term: ["utm_term"]
};
var getCampaign = () => {
    const referrer = Document.referrer && new URL(Document.referrer);
    const location = Document.location && new URL(Document.location);
    const campaign = {};
    mapUTM((key, value) => {
        const val = value
            .map(key => (referrer && referrer.searchParams.get(key)) ||
            (location && location.searchParams.get(key)) ||
            Window.sessionStorage.getItem(`__as.${key}`))
            .find(Boolean);
        if (val)
            campaign[key.substr(4)] = val;
    });
    return campaign;
};
const mapUTM = (fn) => Object.keys(UTM).map(key => fn(key, UTM[key]));
const setUTMAliases = (aliases) => {
    Object.keys(aliases).forEach(key => {
        UTM[key] = UTM[key].concat(aliases[key]);
    });
};

/**
 * @module partner
 */
const KEY = {
    PARTNER_ID_KEY: "__as.partner_id",
    PARTNER_SID_KEY: "__as.partner_sid"
};
const key = (name, value) => {
    if (value) {
        KEY[name] = value;
        updatePartnerInfo();
    }
    return KEY[name];
};
const updatePartnerInfo = () => {
    const uri = Document.location && new URL(Document.location);
    let partnerId = uri.searchParams.get(key("PARTNER_ID_KEY")) || "";
    let partnerSId = uri.searchParams.get(key("PARTNER_SID_KEY")) || "";
    mapUTM((key, values) => {
        const keyValue = values
            .map(key => decodeURIComponent(uri.searchParams.get(key) || ""))
            .find(Boolean) || "";
        if (keyValue) {
            Window.sessionStorage.setItem(`__as.${key}`, keyValue);
        }
        else {
            Window.sessionStorage.removeItem(`__as.${key}`);
        }
    });
    if (partnerId) {
        Window.sessionStorage.setItem(key("PARTNER_ID_KEY"), partnerId);
    }
    else {
        Window.sessionStorage.removeItem(key("PARTNER_ID_KEY"));
    }
    if (partnerSId) {
        Window.sessionStorage.setItem(key("PARTNER_SID_KEY"), partnerSId);
    }
    else {
        Window.sessionStorage.removeItem(key("PARTNER_SID_KEY"));
    }
};
const setPartnerInfo = () => {
    const referrer = Document.referrer && new URL(Document.referrer).host;
    const currentHost = Document.location && new URL(Document.location).host;
    if (referrer && referrer !== currentHost) {
        updatePartnerInfo();
    }
};
const getID = () => Window.sessionStorage.getItem(key("PARTNER_ID_KEY")) || "";
const getSID = () => Window.sessionStorage.getItem(key("PARTNER_SID_KEY")) || "";

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
const SESSION_EXPIRE_TIMEOUT = 30 * 60 * 1000;
const SESSION_COOKIE_NAME = "__asa_session";
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
class SessionManager {
    hasSession() {
        try {
            return !!(getSession().t > Date.now());
        }
        catch (e) {
            return false;
        }
    }
    createSession(data) {
        const campaign = getCampaign();
        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(Object.assign({}, data, (campaign && { campaign }), { id: `${getDomain()}.${hex_sha1(`${getUser()}.${uid()}`)}`, t: Date.now() + SESSION_EXPIRE_TIMEOUT })));
    }
    destroySession() {
        return sessionStore.removeItem(SESSION_COOKIE_NAME);
    }
    getSession() {
        return JSON.parse(sessionStore.getItem(SESSION_COOKIE_NAME) || "{}");
    }
    refreshSession(data) {
        const campaign = getCampaign();
        const session = Object.assign({}, this.getSession(), (campaign && { campaign }), data, { t: Date.now() + SESSION_EXPIRE_TIMEOUT });
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
const getSession = () => sessionManager.getSession();
const createSession = (data) => sessionManager.createSession(data);
const hasSession = () => sessionManager.hasSession();
const refreshSession = (data) => sessionManager.refreshSession(data);

/**
 * @module microdata
 */
const extractFromHead = () => {
    const keywords = document.querySelector('head > meta[name="keywords"]');
    return _mapper(Array.prototype.reduce.call(document.querySelectorAll('head > meta[property^="og:"]'), (acc, curr) => (Object.assign({}, acc, { [curr.getAttribute("property")]: curr.getAttribute("content") })), {
        keywords: keywords && keywords.getAttribute("content")
    }));
};
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

/**
 * @module tracking
 */
const isAnchor = (target) => target && "href" in target;
const isFormElement = (target) => target && "form" in target;
function track(tenant, domains) {
    const domainsTracked = domains;
    const tracker = ({ target }) => {
        if (!target)
            return;
        if (isAnchor(target)) {
            const destination = new URL(target.href);
            if (~domainsTracked.indexOf(destination.host)) {
                destination.searchParams.set(key("PARTNER_ID_KEY"), tenant);
                destination.searchParams.set(key("PARTNER_SID_KEY"), getSession().id);
                const campaign = getSession().campaign || {};
                mapUTM((key$$1) => {
                    const value = campaign[key$$1.substr(4)];
                    if (value) {
                        destination.searchParams.set(key$$1, value);
                    }
                });
                target.href = destination.href;
            }
        }
        else if (isFormElement(target)) {
            const inputs = ["input", "input"].map(document.createElement);
            inputs[0].name = key("PARTNER_ID_KEY");
            inputs[0].value = tenant;
            inputs[1].name = key("PARTNER_SID_KEY");
            inputs[1].value = getSession().id;
            inputs.forEach((input) => {
                input.type = "hidden";
                target.form && target.form.appendChild(input);
            });
        }
    };
    document.addEventListener("mousedown", tracker);
    document.addEventListener("keyup", tracker);
    document.addEventListener("touchstart", tracker);
}

var version = "1.1.78";

/**
 * @module event
 */
const webEvent = (type) => {
    const { id, referrer, campaign, tenant } = getSession();
    const meta = extractFromHead();
    const partner_id = getID();
    const partner_sid = getSID();
    const origin = Window.location.origin;
    const occurred = new Date();
    const page = { url: Window.location.href, referrer };
    const title = document.title.toString();
    return {
        type,
        partner_id,
        partner_sid,
        origin,
        occurred,
        campaign,
        title,
        user: { did: getUser(), sid: id },
        page,
        meta,
        tenant,
        v: version
    };
};
var IDType;
(function (IDType) {
    IDType["Email"] = "Email";
})(IDType || (IDType = {}));
const paymentEvent = (orders) => {
    const event = webEvent("as.web.payment.completed");
    event.orders = orders.map(o => {
        if (typeof o === "string")
            return o;
        if (o.type)
            return o.type + "/" + o.id;
        return o.id;
    });
    return event;
};
const productEvent = (productids) => {
    const event = webEvent("as.web.product.viewed");
    event.products = productids.map(p => {
        if (typeof p === "string")
            return p;
        if (p.type)
            return p.type + "/" + p.id;
        return p.id;
    });
    return event;
};
const web = {
    "as.web.session.started": () => webEvent("as.web.session.started"),
    "as.web.session.resumed": () => webEvent("as.web.session.resumed"),
    "as.web.product.viewed": productEvent,
    "as.web.payment.completed": paymentEvent
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
const EVENT = (data) => POST("//inbox2.activitystream.com/asa", data);
const ERROR = (data) => POST("//inbox2.activitystream.com/asa/error", data);
const submitEvent = ev => EVENT({
    tid: "web.asa",
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
function Dispatcher() {
    let tenant = null;
    let providers = [];
    return function Dispatcher(name, ...data) {
        const setTenantId = (id) => {
            tenant = id;
            if (!hasSession()) {
                const referrer = Document.referrer && new URL(Document.referrer).host;
                const location = Document.location && new URL(Document.location.toString()).host;
                logger.log("no session, starting a new one");
                createSession({
                    tenant,
                    referrer: referrer &&
                        location &&
                        referrer !== location &&
                        !~providers.indexOf(referrer)
                        ? referrer
                        : null
                });
                api.submitEvent(webEvent("as.web.session.started"));
            }
            else {
                refreshSession({ tenant });
                api.submitEvent(webEvent("as.web.session.resumed"));
                logger.log("session resumed");
            }
        };
        const local = {
            "create.custom.session": customSession,
            "set.tenant.id": setTenantId,
            "tenant.id.provided": setTenantId,
            "set.connected.partners": (partners) => track(tenant || "", partners),
            "set.service.providers": (domains) => (providers = domains),
            "set.partner.key": (name, value) => key(name, value),
            "set.logger.mode": logger.mode,
            "set.metadata.transformer": setMapper,
            "set.utm.aliases": aliases => {
                setUTMAliases(aliases);
                refreshSession();
            }
        };
        try {
            if (!web[name]) {
                if (local[name]) {
                    local[name](...data);
                }
                return;
            }
            api.submitEvent(web[name](...data));
        }
        catch (error) {
            logger.force("inbox exception:", error);
            api.submitError(error, {
                location: "processing inbox message",
                arguments: [event, ...data]
            });
        }
    };
}
var dispatcher = new Dispatcher();

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
