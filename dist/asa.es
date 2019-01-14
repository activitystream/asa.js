import 'promise-polyfill/src/polyfill';
import { URLSearchParams } from 'whatwg-url';
import 'whatwg-fetch';

const storageAPI = () => {
    let store = {};
    return {
        setItem(prop, value) {
            store[prop] = value;
        },
        getItem(prop) {
            return store[prop];
        },
        removeItem(prop) {
            delete store[prop];
        },
        clear() {
            store = {};
        },
        key(index) {
            return store[Object.keys(store)[index]];
        },
        get length() {
            return Object.keys(store).length;
        }
    };
};

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
                anchor["searchParams"] = new URLSearchParams(anchor.search);
                return anchor;
            }
        }
    });
}

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
var getCampaign = ({ referrer, location, storage }) => {
    const campaign = {};
    mapUTM((key, value) => {
        const val = value
            .map(key => (referrer && referrer.searchParams.get(key)) ||
            location.searchParams.get(key) ||
            storage.getItem(`__as.${key}`))
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
const updatePartnerInfo = ({ location, storage }) => {
    let partnerId = location.searchParams.get(KEY.PARTNER_ID_KEY) || "";
    let partnerSId = location.searchParams.get(KEY.PARTNER_SID_KEY) || "";
    mapUTM((key, values) => {
        const keyValue = values
            .map(key => decodeURIComponent(location.searchParams.get(key) || ""))
            .find(Boolean) || "";
        if (keyValue) {
            storage.setItem(`__as.${key}`, keyValue);
        }
        else {
            storage.removeItem(`__as.${key}`);
        }
    });
    if (partnerId) {
        storage.setItem(KEY.PARTNER_ID_KEY, partnerId);
    }
    else {
        storage.removeItem(KEY.PARTNER_ID_KEY);
    }
    if (partnerSId) {
        storage.setItem(KEY.PARTNER_SID_KEY, partnerSId);
    }
    else {
        storage.removeItem(KEY.PARTNER_SID_KEY);
    }
};
const setPartnerInfo = (attrs) => {
    const referrer = attrs.referrer && attrs.referrer.host;
    const currentHost = attrs.location.host;
    if (referrer && referrer !== currentHost) {
        updatePartnerInfo(attrs);
    }
};
const getID = (storage) => storage.getItem(KEY.PARTNER_ID_KEY) || "";
const getSID = (storage) => storage.getItem(KEY.PARTNER_SID_KEY) || "";

/**
 * @module logger
 */
const log = (...message) => {
    try {
        console.log(...message);
    }
    catch (e) {
        // swallow error
    }
};
class Logger {
    constructor() {
        this._logger = Logger.none;
    }
    static none(...args) { }
    static console(...args) {
        log("js", ...args);
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

/**
 * @module session
 */
const SESSION_EXPIRE_TIMEOUT = 30 * 60 * 1000;
const SESSION_COOKIE_NAME = "__asa_session";
const createSessionManager = (attrs) => {
    const { storage, user, location } = attrs;
    return {
        hasSession,
        getSession,
        createSession,
        destroySession,
        refreshSession
    };
    function getSession() {
        let session;
        try {
            session = JSON.parse(storage.getItem(SESSION_COOKIE_NAME));
        }
        catch (e) {
            session = {
                id: "",
                tenant: "",
                t: 0
            };
        }
        session.referrer = session.referrer && new URL(session.referrer.toString());
        return session;
    }
    function createSession(data) {
        const campaign = getCampaign(attrs);
        storage.setItem(SESSION_COOKIE_NAME, JSON.stringify({
            ...data,
            ...(campaign && { campaign }),
            id: `${hex_sha1(location.host)}.${hex_sha1(`${user.getUser()}.${uid()}`)}`,
            t: Date.now() + SESSION_EXPIRE_TIMEOUT
        }));
    }
    function destroySession() {
        storage.removeItem(SESSION_COOKIE_NAME);
    }
    function refreshSession(data) {
        const campaign = getCampaign(data);
        const oldSession = getSession();
        const session = {
            ...oldSession,
            ...(campaign && { campaign }),
            ...data,
            data: { ...(oldSession.data || {}), ...(data.data || {}) },
            t: Date.now() + SESSION_EXPIRE_TIMEOUT
        };
        storage.setItem(SESSION_COOKIE_NAME, JSON.stringify(session));
    }
    function hasSession() {
        try {
            return !!(getSession().t > Date.now());
        }
        catch (e) {
            return false;
        }
    }
};

/**
 * @module microdata
 */
const extractFromHead = () => {
    const keywords = document.querySelector('head > meta[name="keywords"]');
    return _mapper(Array.prototype.reduce.call(document.querySelectorAll('head > meta[property^="og:"]'), (acc, curr) => ({
        ...acc,
        [curr.getAttribute("property")]: curr.getAttribute("content")
    }), {
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
function track({ session, tenant, domains }) {
    const domainsTracked = domains;
    const tracker = ({ target }) => {
        if (!target)
            return;
        if (isAnchor(target)) {
            const destination = new URL(target.href);
            if (~domainsTracked.indexOf(destination.host)) {
                destination.searchParams.set(KEY.PARTNER_ID_KEY, tenant);
                destination.searchParams.set(KEY.PARTNER_SID_KEY, session.getSession().id);
                const campaign = session.getSession().campaign || {};
                mapUTM((key) => {
                    const value = campaign[key.substr(4)];
                    if (value) {
                        destination.searchParams.set(key, value);
                    }
                });
                target.href = destination.href;
            }
        }
        else if (isFormElement(target)) {
            const inputs = ["input", "input"].map(document.createElement);
            inputs[0].name = KEY.PARTNER_ID_KEY;
            inputs[0].value = tenant;
            inputs[1].name = KEY.PARTNER_SID_KEY;
            inputs[1].value = session.getSession().id;
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

var version = "2.0.0";

/**
 * @module event
 */
const webEvent = ({ location, title, storage, user, session }, type) => {
    const { id, referrer, campaign, tenant } = session.getSession();
    const meta = extractFromHead();
    const partner_id = getID(storage);
    const partner_sid = getSID(storage);
    const origin = location.origin;
    const occurred = new Date();
    const page = {
        url: location.href,
        referrer: referrer ? referrer.hostname : undefined
    };
    return {
        type,
        partner_id,
        partner_sid,
        origin,
        occurred,
        campaign,
        title,
        user: { did: user.getUser(), sid: id },
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
const paymentEvent = (attrs, orders) => {
    const event = webEvent(attrs, "as.web.payment.completed");
    event.orders = orders.map(o => {
        if (typeof o === "string")
            return o;
        if (o.type)
            return o.type + "/" + o.id;
        return o.id;
    });
    return event;
};
const productEvent = (attrs, productids) => {
    const event = webEvent(attrs, "as.web.product.viewed");
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
    "as.web.session.started": (attrs) => webEvent(attrs, "as.web.session.started"),
    "as.web.session.resumed": (attrs) => webEvent(attrs, "as.web.session.resumed"),
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
 * @module user
 */
const USER_ID_COOKIE = "__as_user";
const createUserManager = ({ storage, location }) => {
    let isNew = false;
    return {
        getUser,
        setUser,
        clearUser,
        getHash,
        isUserNew
    };
    function setUser(id) {
        if (!id)
            id = generateUser(location.host, uid());
        storage.setItem(USER_ID_COOKIE, id);
        isNew = true;
        return id;
    }
    function clearUser() {
        storage.removeItem(USER_ID_COOKIE);
    }
    function getUser() {
        let user = storage.getItem(USER_ID_COOKIE);
        // migrations
        if (!user || user.length > 70 || user.length < 40) {
            user = setUser();
        }
        return user;
    }
    function getHash() {
        return getUser().split(".")[1];
    }
    function isUserNew() {
        return isNew;
    }
};
const generateUser = (domain, id) => `${hex_sha1(domain)}.${hex_sha1(id)}`;

/**
 * @module dispatcher
 */
function Dispatcher(attrs) {
    let tenant = "";
    let providers = [];
    const isPartner = (host) => providers.indexOf(host) > -1;
    const user = createUserManager(attrs);
    let session = createSessionManager({
        ...attrs,
        user,
        tenant: "",
        isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
    });
    const eventAttrs = {
        ...attrs,
        user,
        session
    };
    const setTenantId = (id) => {
        tenant = id;
        if (!session.hasSession()) {
            logger.log("no session, starting a new one");
            session.createSession({
                ...attrs,
                tenant,
                user,
                isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
            });
            api.submitEvent(webEvent(eventAttrs, "as.web.session.started"));
        }
        else {
            session.refreshSession({
                ...attrs,
                tenant,
                user,
                isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
            });
            api.submitEvent(webEvent(eventAttrs, "as.web.session.resumed"));
            logger.log("session resumed");
        }
    };
    const types = {
        "create.custom.session": (sessionManager) => {
            session = sessionManager;
            eventAttrs.session = session;
        },
        "set.tenant.id": setTenantId,
        "tenant.id.provided": setTenantId,
        "set.connected.partners": (partners) => track({ session, tenant: tenant || "", domains: partners }),
        "set.service.providers": (domains) => (providers = domains),
        "set.partner.key": (name, value) => {
            KEY[name] = value;
            setPartnerInfo(eventAttrs);
        },
        "set.logger.mode": logger.mode,
        "set.metadata.transformer": setMapper,
        "set.utm.aliases": (aliases) => {
            setUTMAliases(aliases);
            session.refreshSession({
                ...attrs,
                tenant,
                user,
                isPartner: attrs.referrer ? isPartner(attrs.referrer.hostname) : false
            });
        }
    };
    return function Dispatcher(type, ...data) {
        try {
            if (!(type in web)) {
                if (type in types) {
                    types[type](...data);
                }
                return;
            }
            api.submitEvent(web[type](eventAttrs, ...data));
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

var boot = () => {
    try {
        const queue = (window.asa && window.asa["q"]) || [];
        const attrs = {
            location: new URL(document.location.toString()),
            referrer: document.referrer ? new URL(document.referrer) : undefined,
            storage: sessionStorage,
            title: document.title
        };
        window.asa = Dispatcher(attrs);
        setPartnerInfo(attrs);
        queue.forEach(
        // @ts-ignore: We trust this
        (args) => window.asa(...args));
    }
    catch (e) {
        logger.force("exception during init: ", e);
        api.submitError(e, { location: "boot script" });
    }
};

boot();
