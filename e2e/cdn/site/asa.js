/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    __webpack_require__(1)();
	})();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var browser = __webpack_require__(2);
	var runBootSequence = function(bootSequence){
	    bootSequence = bootSequence || [];
	    if (!(bootSequence instanceof Array)) bootSequence = [bootSequence];
	
	    for (var i = 0; i < bootSequence.length; i++) {
	        browser.window.asa.apply(null, bootSequence[i]);
	    }
	};
	
	__webpack_require__(3)();
	
	module.exports = function(bootSequence){
	    // var DNT = navigator.doNotTrack || navigator.msDoNotTrack || browser.window.doNotTrack;
	    // if (DNT && (DNT === 'yes' || DNT.charAt(0) === '1')) return;
		var partner = __webpack_require__(4);
		var autoTrack = __webpack_require__(6);
		var debug = __webpack_require__(8);
		var inbox = __webpack_require__(27);
		var server = __webpack_require__(16);
		var features = __webpack_require__(24);
	
		try {
			var pendingEvents = [];
			if ((typeof browser.window.asa !== 'undefined') && (typeof browser.window.asa.q !== 'undefined')) {
				pendingEvents = browser.window.asa.q;
			}
	
			browser.window.asa = inbox(server.submitEvent);
	
			// features.defineExperiment(features.MINI_AJAX, 10);
	        partner.setPartnerInfo();
	        runBootSequence(bootSequence);
	
			for (var i = 0; i < pendingEvents.length; i++) {
				browser.window.asa.apply(null, pendingEvents[i]);
			}
	
			// autoTrack.sections();
		} catch (e) {
			debug.forceLog('exception during init: ', e);
	        server.submitError(e, {location : 'boot script'});
		}
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	    window : window,
	    document : document    
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	function installTrimPolyfill() {
	    if (!String.prototype.trim) {
	        String.prototype.trim = function() {
	            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	        };
	    }
	}
	function installEndsWithPolyfill() {
	    if (!String.prototype.endsWith) {
	        String.prototype.endsWith = function(searchString, position) {
	            var subjectString = this.toString();
	            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
	                position = subjectString.length;
	            }
	            position -= searchString.length;
	            var lastIndex = subjectString.indexOf(searchString, position);
	            return lastIndex !== -1 && lastIndex === position;
	        };
	    }
	}
	module.exports = function() {
	    installTrimPolyfill();
	    installEndsWithPolyfill();
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var parseUri = __webpack_require__(5);
	var browser = __webpack_require__(2);
	
	var updatePartnerInfo = function (){
		var partnerIdKey = '__as.partner_id';
		var partnerSIdKey = '__as.partner_sid';
		var asaPartnerKey = '__asa';
		var utmKeys = ['utm_medium','utm_source','utm_campaign','utm_content','utm_term'];
		var uri = parseUri(browser.window.location.href);
		var asaPartnerValue = decodeURIComponent(uri.queryKey.__asa || '').split('|');
		var partnerId;
		var partnerSId;
		if (asaPartnerValue) {
			partnerId = asaPartnerValue[0];
			partnerSId = asaPartnerValue[1];
		}
	
		utmKeys.forEach(function (key) {
			var keyValue = decodeURIComponent(uri.queryKey[key] || '');
			if (keyValue) {
				browser.window.sessionStorage.setItem('__as.' + key, keyValue);
			} else {
				browser.window.sessionStorage.removeItem('__as.' + key);
			}
		});
	
		if (partnerId){
			browser.window.sessionStorage.setItem(partnerIdKey, partnerId);
		} else {
			browser.window.sessionStorage.removeItem(partnerIdKey);
		}
		if (partnerSId){
			browser.window.sessionStorage.setItem(partnerSIdKey, partnerSId);
		} else {
			browser.window.sessionStorage.removeItem(partnerSIdKey);
		}
	};
	module.exports = {
	
		setPartnerInfo : function(){
			var referrer = parseUri(browser.document.referrer).authority;
			var currentHost = parseUri(browser.window.location.origin).authority;
			if (referrer != currentHost){
				updatePartnerInfo();
			}
		}
	
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License
	
	function parseUri (str) {
		var	o   = parseUri.options,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i   = 14;
	
		while (i--) uri[o.key[i]] = m[i] || "";
	
		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});
	
		return uri;
	}
	
	parseUri.options = {
		strictMode: false,
		key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
		q:   {
			name:   "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};
	
	module.exports = parseUri;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var session = __webpack_require__(7);
	var parseUri = __webpack_require__(5);
	var browser = __webpack_require__(2);
	
	module.exports = {
		sections: function () {
			var locationHashChanged = function (oldHash, newHash) {
				asa('sectionentered', newHash.substr(1));
			};
			var storedHash = '';
			browser.window.setInterval(function () {
				if (browser.window.location.hash != storedHash) {
					var newHash = browser.window.location.hash;
					locationHashChanged(storedHash, newHash);
					storedHash = newHash;
				}
			}, 100);
		},
	
		links: function (domains) {
			var domainsTracked = domains;
			var tracker = function (ev) {
				var href = ev.target.href;
				if (href) {
					var destination = parseUri(href);
					if (domainsTracked.indexOf(destination.authority) > -1) {
	                    if (!destination.queryKey['__asa']){
	                        var alreadyHasParams = ev.target.href.indexOf('?') !== -1;
	                        href = href + (alreadyHasParams ? '&' : '?') + '__asa=' + encodeURIComponent(browser.window.asaId+'|'+session.getSession().id);
	                        ev.target.href = href;
	                    }
						var utmKeys = ['utm_medium','utm_source','utm_campaign','utm_content','utm_term'];
					    var __as__campagin = {};
					    utmKeys.forEach(function (utm_key) {
					        var utm_value = browser.window.sessionStorage.getItem('__as.' + utm_key);
					        if (utm_value) {
					            __as__campagin[utm_key] = utm_value;
					        }
					    });
						if (Object.keys(__as__campagin).length) {
							if (!Object.keys(destination.queryKey).some(function (key) {
								return key.indexOf('utm_') !== -1;
							})) {
								var hasParams = href.indexOf('?') !== -1;
								Object.keys(__as__campagin).forEach(function(d,i) {
									href = href + (!hasParams && i === 0 ? '?' : '&') + d + '=' + encodeURIComponent(__as__campagin[d]);
								});
								ev.target.href = href;
							}
						}
					}
				}
			};
			browser.document.addEventListener('mousedown', tracker);
			browser.document.addEventListener('keyup', tracker);
			browser.document.addEventListener('touchstart', tracker);
		}
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var debug = __webpack_require__(8);
	var user = __webpack_require__(9);
	var randomness = __webpack_require__(13);
	var hash = __webpack_require__(11).sessionHash;
	var Cookies = __webpack_require__(14);
	var _ = __webpack_require__(15);
	
	
	var persistence = {
	    get: function(id) {
	        try {
	            return Cookies.getItem(id);
	        } catch (e) {
	            throw new Error('Error while trying to get item from session cookie:' + id);
	        }
	    },
	    set: function(id, value) {
	        try {
	            return Cookies.setItem(id, value, Infinity, '/');
	        } catch (e) {
	            throw new Error('Error while trying to set item to session cookie: "' + id + '" <- ' + value);
	        }
	    }
	}
	
	var store = {
	    hasItem: function(name) {
	        var item = persistence.get(name);
	        return item;
	    },
	    getItem: function(name) {
	        return persistence.get(name);
	    },
	    setItem: function(name, value) {
	        persistence.set(name, value);
	    },
	};
	
	var sessionStore = store;
	
	var SESSION_EXPIRE_TIMEOUT = 30 * 60 * 1000;
	var SESSION_COOKIE_NAME = '__asa_session';
	
	var builtinSessionManager = {
	    hasSession: function() {
	        var item = sessionStore.hasItem(SESSION_COOKIE_NAME);
	        try{
	            return item && JSON.parse(item).t > (1 * new Date());            
	        } catch(e) {
	            return false;
	        }
	    },
	
	    createSession: function(sessionData) {
	        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(_.override(sessionData, { id: user.getDomainId() + '.' + hash(user.getUserId() + '.' + randomness.getNumber()), t: ((1 * new Date()) + SESSION_EXPIRE_TIMEOUT) })));
	    },
	
	    getSession: function() {
	        return JSON.parse(sessionStore.getItem(SESSION_COOKIE_NAME));
	    },
	    
	    updateTimeout: function updateTimeout(sessionData){
	        var session = this.getSession();
	        var sessionId = session.id;
	        session = _.override(session, sessionData);
	        session.t = ((1 * new Date()) + SESSION_EXPIRE_TIMEOUT);
	        session.id = sessionId;
	        
	        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(session));
	    }
	
	};
	var providedSessionManager = function(hasSessions, getSession, createSession) {
	    return {
	        hasSession: function() {
	            return hasSessions();
	        },
	
	        createSession: function() {
	            createSession();
	        },
	
	        getSession: function() {
	            return getSession();
	        }
	    };
	};
	var sessionManager = builtinSessionManager;
	module.exports = {
	    getSession: function() {
	        return sessionManager.getSession();
	    },
	    hasSession: function() {
	        return !!(sessionManager.hasSession());
	    },
	    createSession: function(sessionData) {
	        sessionManager.createSession(sessionData);
	    },
	    customSession: function(hasSessions, getSession, createSession) {
	        sessionManager = providedSessionManager(hasSessions, getSession, createSession);
	    },
	    resetSessionMgmt: function resetSessionMgmt() {
	        sessionManager = builtinSessionManager;
	    },
	    updateTimeout: function updateTimeout(sessionData){
	        sessionManager.updateTimeout(sessionData);
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	// old ie
	if (typeof console === 'undefined') {
		window.console = {};
	}
	if (typeof console.log === 'undefined'){
		window.console.log = function(){};
	}
	
	var noLog = function noLog() { };
	var doLog = function doLog() {
		[].unshift.call(arguments, 'asa.js:');
		console.log.apply(console, arguments);
	};
	var me = module.exports = {
		log: noLog,
		setDebugMode: function (on) {
			me.log = on ? doLog : noLog;
		},
		forceLog:doLog
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// var cookies = require('./cookies');
	var Cookies = __webpack_require__(10);
	var domainHash = __webpack_require__(11).domainHash;
	var userHash = __webpack_require__(11).userHash;
	var randomness = __webpack_require__(13);
	var USER_ID_COOKIE = '__as_user';
	var browser = __webpack_require__(2);
	
	var generateUserId = function () {
		return domainHash(browser.window.location.host) + '.' + userHash('' + randomness.getNumber());
	};
	
	var userCreated = false;
	
	var setUserId = function() {
	    var userId = generateUserId();
	    Cookies.set(USER_ID_COOKIE, userId, {expires: Infinity, path : '/'});
	    // return userId;    
	}
	
	var getUserId = function () {
		if (!Cookies.get(USER_ID_COOKIE)) {
	        userCreated = true;
	        setUserId();
		}
	
	    var userId = Cookies.get(USER_ID_COOKIE);
	    if (userId.length > 70 || userId.length < 40) {
	        // we need proper migrations here
	        setUserId();
	        userId = Cookies.get(USER_ID_COOKIE);
	    }
	
		return userId;
	};
	
	module.exports = {
		getUserId: getUserId,
		getDomainId: function () {
			return domainHash(browser.window.location.host);
		},
		getUserHash: function () {
			return domainHash(getUserId().split('.')[1]);
		},
	    getAndResetNewUserStatus : function(){
	        if (userCreated) {
	            userCreated = false;
	            return true;
	        } else 
	            return false;
	    }
	    
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Cookies.js - 1.2.3
	 * https://github.com/ScottHamper/Cookies
	 *
	 * This is free and unencumbered software released into the public domain.
	 */
	(function (global, undefined) {
	    'use strict';
	
	    var factory = function (window) {
	        if (typeof window.document !== 'object') {
	            throw new Error('Cookies.js requires a `window` with a `document` object');
	        }
	
	        var Cookies = function (key, value, options) {
	            return arguments.length === 1 ?
	                Cookies.get(key) : Cookies.set(key, value, options);
	        };
	
	        // Allows for setter injection in unit tests
	        Cookies._document = window.document;
	
	        // Used to ensure cookie keys do not collide with
	        // built-in `Object` properties
	        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
	        
	        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');
	
	        Cookies.defaults = {
	            path: '/',
	            secure: false
	        };
	
	        Cookies.get = function (key) {
	            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
	                Cookies._renewCache();
	            }
	            
	            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];
	
	            return value === undefined ? undefined : decodeURIComponent(value);
	        };
	
	        Cookies.set = function (key, value, options) {
	            options = Cookies._getExtendedOptions(options);
	            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);
	
	            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);
	
	            return Cookies;
	        };
	
	        Cookies.expire = function (key, options) {
	            return Cookies.set(key, undefined, options);
	        };
	
	        Cookies._getExtendedOptions = function (options) {
	            return {
	                path: options && options.path || Cookies.defaults.path,
	                domain: options && options.domain || Cookies.defaults.domain,
	                expires: options && options.expires || Cookies.defaults.expires,
	                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
	            };
	        };
	
	        Cookies._isValidDate = function (date) {
	            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
	        };
	
	        Cookies._getExpiresDate = function (expires, now) {
	            now = now || new Date();
	
	            if (typeof expires === 'number') {
	                expires = expires === Infinity ?
	                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
	            } else if (typeof expires === 'string') {
	                expires = new Date(expires);
	            }
	
	            if (expires && !Cookies._isValidDate(expires)) {
	                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
	            }
	
	            return expires;
	        };
	
	        Cookies._generateCookieString = function (key, value, options) {
	            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
	            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
	            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
	            options = options || {};
	
	            var cookieString = key + '=' + value;
	            cookieString += options.path ? ';path=' + options.path : '';
	            cookieString += options.domain ? ';domain=' + options.domain : '';
	            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
	            cookieString += options.secure ? ';secure' : '';
	
	            return cookieString;
	        };
	
	        Cookies._getCacheFromString = function (documentCookie) {
	            var cookieCache = {};
	            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];
	
	            for (var i = 0; i < cookiesArray.length; i++) {
	                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);
	
	                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
	                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
	                }
	            }
	
	            return cookieCache;
	        };
	
	        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
	            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
	            var separatorIndex = cookieString.indexOf('=');
	
	            // IE omits the "=" when the cookie value is an empty string
	            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;
	
	            var key = cookieString.substr(0, separatorIndex);
	            var decodedKey;
	            try {
	                decodedKey = decodeURIComponent(key);
	            } catch (e) {
	                if (console && typeof console.error === 'function') {
	                    console.error('Could not decode cookie with key "' + key + '"', e);
	                }
	            }
	            
	            return {
	                key: decodedKey,
	                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
	            };
	        };
	
	        Cookies._renewCache = function () {
	            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
	            Cookies._cachedDocumentCookie = Cookies._document.cookie;
	        };
	
	        Cookies._areEnabled = function () {
	            var testKey = 'cookies.js';
	            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
	            Cookies.expire(testKey);
	            return areEnabled;
	        };
	
	        Cookies.enabled = Cookies._areEnabled();
	
	        return Cookies;
	    };
	    var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;
	
	    // AMD support
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () { return cookiesExport; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    // CommonJS/Node.js support
	    } else if (typeof exports === 'object') {
	        // Support Node.js specific `module.exports` (which can be a function)
	        if (typeof module === 'object' && typeof module.exports === 'object') {
	            exports = module.exports = cookiesExport;
	        }
	        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
	        exports.Cookies = cookiesExport;
	    } else {
	        global.Cookies = cookiesExport;
	    }
	})(typeof window === 'undefined' ? this : window);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// this hashing algorithm is as found in some version of Google Analytics
	/* jshint ignore:start */
	var sha = __webpack_require__(12);
	function hash(d) {
	    var a = 1, c = 0, h, o;
	    if (d) {
	        a = 0;
	        for (h = d["length"] - 1; h >= 0; h--) {
	            o = d.charCodeAt(h);
	            a = (a << 6 & 268435455) + o + (o << 14);
	            c = a & 266338304;
	            a = c != 0 ? a ^ c >> 21 : a
	        }
	    }
	    return a
	};
	
	module.exports = {
	    domainHash : hash,
	    sessionHash : sha,
	    userHash : sha
	}; 
	
	/* jshint ignore:end */


/***/ },
/* 12 */
/***/ function(module, exports) {

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS 180-1
	 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */
	
	/*
	 * Configurable variables. You may need to tweak these to be compatible with
	 * the server-side, but the defaults work in most cases.
	 */
	var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
	
	/*
	 * These are the functions you'll usually want to call
	 * They take string arguments and return either hex or base-64 encoded strings
	 */
	function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
	function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
	function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
	function hex_hmac_sha1(k, d)
	  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
	function b64_hmac_sha1(k, d)
	  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
	function any_hmac_sha1(k, d, e)
	  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }
	
	/*
	 * Perform a simple self-test to see if the VM is working
	 */
	function sha1_vm_test()
	{
	  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
	}
	
	/*
	 * Calculate the SHA1 of a raw string
	 */
	function rstr_sha1(s)
	{
	  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
	}
	
	/*
	 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
	 */
	function rstr_hmac_sha1(key, data)
	{
	  var bkey = rstr2binb(key);
	  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);
	
	  var ipad = Array(16), opad = Array(16);
	  for(var i = 0; i < 16; i++)
	  {
	    ipad[i] = bkey[i] ^ 0x36363636;
	    opad[i] = bkey[i] ^ 0x5C5C5C5C;
	  }
	
	  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
	  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
	}
	
	/*
	 * Convert a raw string to a hex string
	 */
	function rstr2hex(input)
	{
	  try { hexcase } catch(e) { hexcase=0; }
	  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	  var output = "";
	  var x;
	  for(var i = 0; i < input.length; i++)
	  {
	    x = input.charCodeAt(i);
	    output += hex_tab.charAt((x >>> 4) & 0x0F)
	           +  hex_tab.charAt( x        & 0x0F);
	  }
	  return output;
	}
	
	/*
	 * Convert a raw string to a base-64 string
	 */
	function rstr2b64(input)
	{
	  try { b64pad } catch(e) { b64pad=''; }
	  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	  var output = "";
	  var len = input.length;
	  for(var i = 0; i < len; i += 3)
	  {
	    var triplet = (input.charCodeAt(i) << 16)
	                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
	                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
	    for(var j = 0; j < 4; j++)
	    {
	      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
	      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
	    }
	  }
	  return output;
	}
	
	/*
	 * Convert a raw string to an arbitrary string encoding
	 */
	function rstr2any(input, encoding)
	{
	  var divisor = encoding.length;
	  var remainders = Array();
	  var i, q, x, quotient;
	
	  /* Convert to an array of 16-bit big-endian values, forming the dividend */
	  var dividend = Array(Math.ceil(input.length / 2));
	  for(i = 0; i < dividend.length; i++)
	  {
	    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
	  }
	
	  /*
	   * Repeatedly perform a long division. The binary array forms the dividend,
	   * the length of the encoding is the divisor. Once computed, the quotient
	   * forms the dividend for the next step. We stop when the dividend is zero.
	   * All remainders are stored for later use.
	   */
	  while(dividend.length > 0)
	  {
	    quotient = Array();
	    x = 0;
	    for(i = 0; i < dividend.length; i++)
	    {
	      x = (x << 16) + dividend[i];
	      q = Math.floor(x / divisor);
	      x -= q * divisor;
	      if(quotient.length > 0 || q > 0)
	        quotient[quotient.length] = q;
	    }
	    remainders[remainders.length] = x;
	    dividend = quotient;
	  }
	
	  /* Convert the remainders to the output string */
	  var output = "";
	  for(i = remainders.length - 1; i >= 0; i--)
	    output += encoding.charAt(remainders[i]);
	
	  /* Append leading zero equivalents */
	  var full_length = Math.ceil(input.length * 8 /
	                                    (Math.log(encoding.length) / Math.log(2)))
	  for(i = output.length; i < full_length; i++)
	    output = encoding[0] + output;
	
	  return output;
	}
	
	/*
	 * Encode a string as utf-8.
	 * For efficiency, this assumes the input is valid utf-16.
	 */
	function str2rstr_utf8(input)
	{
	  var output = "";
	  var i = -1;
	  var x, y;
	
	  while(++i < input.length)
	  {
	    /* Decode utf-16 surrogate pairs */
	    x = input.charCodeAt(i);
	    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
	    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
	    {
	      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
	      i++;
	    }
	
	    /* Encode output as utf-8 */
	    if(x <= 0x7F)
	      output += String.fromCharCode(x);
	    else if(x <= 0x7FF)
	      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
	                                    0x80 | ( x         & 0x3F));
	    else if(x <= 0xFFFF)
	      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
	                                    0x80 | ((x >>> 6 ) & 0x3F),
	                                    0x80 | ( x         & 0x3F));
	    else if(x <= 0x1FFFFF)
	      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
	                                    0x80 | ((x >>> 12) & 0x3F),
	                                    0x80 | ((x >>> 6 ) & 0x3F),
	                                    0x80 | ( x         & 0x3F));
	  }
	  return output;
	}
	
	/*
	 * Encode a string as utf-16
	 */
	function str2rstr_utf16le(input)
	{
	  var output = "";
	  for(var i = 0; i < input.length; i++)
	    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
	                                  (input.charCodeAt(i) >>> 8) & 0xFF);
	  return output;
	}
	
	function str2rstr_utf16be(input)
	{
	  var output = "";
	  for(var i = 0; i < input.length; i++)
	    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
	                                   input.charCodeAt(i)        & 0xFF);
	  return output;
	}
	
	/*
	 * Convert a raw string to an array of big-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */
	function rstr2binb(input)
	{
	  var output = Array(input.length >> 2);
	  for(var i = 0; i < output.length; i++)
	    output[i] = 0;
	  for(var i = 0; i < input.length * 8; i += 8)
	    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
	  return output;
	}
	
	/*
	 * Convert an array of big-endian words to a string
	 */
	function binb2rstr(input)
	{
	  var output = "";
	  for(var i = 0; i < input.length * 32; i += 8)
	    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
	  return output;
	}
	
	/*
	 * Calculate the SHA-1 of an array of big-endian words, and a bit length
	 */
	function binb_sha1(x, len)
	{
	  /* append padding */
	  x[len >> 5] |= 0x80 << (24 - len % 32);
	  x[((len + 64 >> 9) << 4) + 15] = len;
	
	  var w = Array(80);
	  var a =  1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d =  271733878;
	  var e = -1009589776;
	
	  for(var i = 0; i < x.length; i += 16)
	  {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;
	    var olde = e;
	
	    for(var j = 0; j < 80; j++)
	    {
	      if(j < 16) w[j] = x[i + j];
	      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
	      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
	                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
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
	function sha1_ft(t, b, c, d)
	{
	  if(t < 20) return (b & c) | ((~b) & d);
	  if(t < 40) return b ^ c ^ d;
	  if(t < 60) return (b & c) | (b & d) | (c & d);
	  return b ^ c ^ d;
	}
	
	/*
	 * Determine the appropriate additive constant for the current iteration
	 */
	function sha1_kt(t)
	{
	  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
	         (t < 60) ? -1894007588 : -899497514;
	}
	
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}
	
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	}
	
	module.exports = hex_sha1;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		getNumber : function(){
			return Math.round(Math.random() * new Date());
		}
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	/*\
	|*|
	|*|  :: cookies.js ::
	|*|
	|*|  A complete cookies reader/writer framework with full unicode support.
	|*|
	|*|  Revision #1 - September 4, 2014
	|*|
	|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
	|*|  https://developer.mozilla.org/User:fusionchess
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
	
	var docCookies = {
	  getItem: function (sKey) {
	    if (!sKey) { return null; }
	    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	  },
	  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
	    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
	    var sExpires = "";
	    if (vEnd) {
	      switch (vEnd.constructor) {
	        case Number:
	          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
	          break;
	        case String:
	          sExpires = "; expires=" + vEnd;
	          break;
	        case Date:
	          sExpires = "; expires=" + vEnd.toUTCString();
	          break;
	      }
	    }
	    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
	    return true;
	  },
	  removeItem: function (sKey, sPath, sDomain) {
	    if (!this.hasItem(sKey)) { return false; }
	    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
	    return true;
	  },
	  hasItem: function (sKey) {
	    if (!sKey) { return false; }
	    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	  },
	  keys: function () {
	    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
	    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
	    return aKeys;
	  }
	};
	
	module.exports = docCookies;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var debug = __webpack_require__(8);
	var server = __webpack_require__(16);
	var copyProps = function copyProps(o1, o2) {
	    for (var key in o2) {
	        if (o2.hasOwnProperty(key) && o2[key] !== undefined) {
	            o1[key] = o2[key];
	        }
	    }
	}
	module.exports = {
	    override: function(o1, o2) {
	        if (!o1 && !o2) return undefined;
	        if (!o1 && o2) return o2;
	        if (o1 && !o2) return o1;
	        var result = {};
	        copyProps(result, o1);
	        copyProps(result, o2);
	        return result;
	    },
	    runSafe: function runSafe(fn, msg, retryPeriod, retryCount, cb) {
	        if (typeof retryCount === 'undefined') {
	            retryCount = 10;
	        }
	        retryPeriod = retryPeriod || 100;
	        cb = cb || function(){};
	        try {
	            fn();
	            cb();
	        } catch (e) {
	            if (retryCount <= 0) {
	                debug.forceLog('runSafe exception: ', e);
	                server.submitError(e, { location: 'runSafe', arguments: arguments, description: msg });
	                cb(e);
	            } else {
	                setTimeout(function(){runSafe(fn, msg, retryPeriod, retryCount - 1, cb)}, retryPeriod);
	            }
	        }
	    }
	
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var r = __webpack_require__(17);
	var debug = __webpack_require__(8);
	var ajax = __webpack_require__(23);
	var features = __webpack_require__(24);
	var formatting = __webpack_require__(25);
	var info = __webpack_require__(26);
	
	var pendingSubmission = [], done = true;
	var batchIntervalHandler;
	
	var eventPostAddress = '//inbox.activitystream.com/asa';
	var errorPostAddress = '//inbox.activitystream.com/asa/error';
	
	var post = function(packet, callback) {
	    var request = ajax.post(eventPostAddress, 'POST', callback);
	    request.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
	    request.send(JSON.stringify(packet));
	};
	
	var submitData = function(data, opts, callback) {
	    opts = opts || { url: eventPostAddress };
	    var packet = {
	        ev: data,
	        t: formatting.formatDateTime(new Date())
	    };
	
	    debug.log('submitting data: ', data);
	    if (features.isExperiment(features.MINI_AJAX)) {
	        post(packet, function(err, res) {
	            if (callback) {
	                callback(err, res);
	            } else {
	                if (err) {
	                    debug.log('error on server', err);
	                } else {
	                    debug.log('server got it');
	                }
	            }
	        });
	
	    } else {
	        r
	            .post(opts.url)
	            .set('Content-Type', 'application/json')
	            .send(packet)
	            .end(function(err, res) {
	                if (callback) {
	                    callback(err, res);
	                } else {
	                    if (err) {
	                        debug.log('error on server', err);
	                    } else {
	                        debug.log('server got it');
	                    }
	                }
	            });
	    }
	}
	
	var submitEvent = function(ev, callback) {
	    if (ev) submitData(ev, { url: eventPostAddress }, callback);
	}
	
	var submitError = function(err, context, callback) {
	    if (typeof context === 'function') {
	        callback = context;
	        context = {};
	    }
	    if (err && (err.code === 22 || err.code === 18)) return;// skipping error 22 and 18 - related to quota storage. it seems related to people browsing in private mode
	    submitData({ err: err, context: context, v: info.version() }, { url: errorPostAddress }, callback);
	}
	
	var submitNow = function(ev) {
	    if (ev instanceof Array) {
	        for (var i = 0; i < ev.length; i++) {
	            submitEvent(ev[i]);
	        }
	    } else {
	        submitEvent(ev);
	    }
	};
	
	var submitNow2 = function(ev) {
	    done = false;
	    submitEvent(ev, function(err, res) {
	        if (err) {
	            debug.log('error on server', err);
	        } else {
	            pendingSubmission.splice(0, ev.length);
	            debug.log('server got it');
	        }
	        done = true;
	    });
	};
	var errorSubmitter;
	var eventSubmitter;
	var setDefaultSubmitters = function() {
	    errorSubmitter = submitError;
	    eventSubmitter = submitNow;
	}
	setDefaultSubmitters();
	module.exports = {
	    submitError: errorSubmitter,
	    submitEvent: eventSubmitter,
	    batchEvent: function(e) {
	        pendingSubmission.push(e);
	    },
	    batchOn: function() {
	        batchIntervalHandler = setInterval(function batchProcessor() {
	            try {
	                if (pendingSubmission.length > 0 && done) {
	                    var batchSize = Math.min(pendingSubmission.length, 10);
	                    submitNow2(pendingSubmission.slice(0, batchSize));
	                }
	            } catch (e) {
	                debug.log('exception submitting', e);
	            }
	        }, 400);
	    },
	    batchOff: function() {
	        if (!batchIntervalHandler) {
	            debug.log('cannot batch off, it is not on');
	        } else {
	            clearInterval(batchIntervalHandler);
	        }
	    },
	    override: function overrideSubmits(submitEv, submitErr) {
	        errorSubmitter = submitErr || errorSubmitter;
	        eventSubmitter = submitEv || eventSubmitter;
	    },
	    reset: setDefaultSubmitters
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var Emitter = __webpack_require__(18);
	var reduce = __webpack_require__(19);
	var requestBase = __webpack_require__(20);
	var isObject = __webpack_require__(21);
	
	/**
	 * Root reference for iframes.
	 */
	
	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  root = this;
	}
	
	/**
	 * Noop.
	 */
	
	function noop(){};
	
	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isHost(obj) {
	  var str = {}.toString.call(obj);
	
	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}
	
	/**
	 * Expose `request`.
	 */
	
	var request = module.exports = __webpack_require__(22).bind(null, Request);
	
	/**
	 * Determine XHR.
	 */
	
	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	};
	
	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */
	
	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };
	
	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */
	
	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pushEncodedKeyValuePair(pairs, key, obj[key]);
	        }
	      }
	  return pairs.join('&');
	}
	
	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */
	
	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (Array.isArray(val)) {
	    return val.forEach(function(v) {
	      pushEncodedKeyValuePair(pairs, key, v);
	    });
	  }
	  pairs.push(encodeURIComponent(key)
	    + '=' + encodeURIComponent(val));
	}
	
	/**
	 * Expose serialization method.
	 */
	
	 request.serializeObject = serialize;
	
	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */
	
	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var parts;
	  var pair;
	
	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    parts = pair.split('=');
	    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	  }
	
	  return obj;
	}
	
	/**
	 * Expose parser.
	 */
	
	request.parseString = parseString;
	
	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */
	
	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};
	
	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */
	
	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };
	
	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */
	
	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};
	
	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;
	
	  lines.pop(); // trailing CRLF
	
	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }
	
	  return fields;
	}
	
	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */
	
	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}
	
	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */
	
	function type(str){
	  return str.split(/ *; */).shift();
	};
	
	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function params(str){
	  return reduce(str.split(/ *; */), function(obj, str){
	    var parts = str.split(/ *= */)
	      , key = parts.shift()
	      , val = parts.shift();
	
	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};
	
	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */
	
	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this.setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this.setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this.parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}
	
	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};
	
	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */
	
	Response.prototype.setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);
	
	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};
	
	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */
	
	Response.prototype.parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};
	
	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */
	
	Response.prototype.setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }
	
	  var type = status / 100 | 0;
	
	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;
	
	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;
	
	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};
	
	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */
	
	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;
	
	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;
	
	  return err;
	};
	
	/**
	 * Expose `Response`.
	 */
	
	request.Response = Response;
	
	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */
	
	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;
	
	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }
	
	    self.emit('response', res);
	
	    if (err) {
	      return self.callback(err, res);
	    }
	
	    if (res.status >= 200 && res.status < 300) {
	      return self.callback(err, res);
	    }
	
	    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	    new_err.original = err;
	    new_err.response = res;
	    new_err.status = res.status;
	
	    self.callback(new_err, res);
	  });
	}
	
	/**
	 * Mixin `Emitter` and `requestBase`.
	 */
	
	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}
	
	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	
	Request.prototype.abort = function(){
	  if (this.aborted) return;
	  this.aborted = true;
	  this.xhr && this.xhr.abort();
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};
	
	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and 
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};
	
	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }
	
	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;
	
	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};
	
	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/
	
	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};
	
	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};
	
	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};
	
	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	  *      request.post('/user')
	  *        .send('name=tobi')
	  *        .send('species=ferret')
	  *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];
	
	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }
	
	  if (!obj || isHost(data)) return this;
	  if (!type) this.type('json');
	  return this;
	};
	
	/**
	 * @deprecated
	 */
	Response.prototype.parse = function serialize(fn){
	  if (root.console) {
	    console.warn("Client-side parse() method has been renamed to serialize(). This method is not compatible with superagent v2.0");
	  }
	  this.serialize(fn);
	  return this;
	};
	
	Response.prototype.serialize = function serialize(fn){
	  this._parser = fn;
	  return this;
	};
	
	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */
	
	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};
	
	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */
	
	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;
	
	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;
	
	  this.callback(err);
	};
	
	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */
	
	Request.prototype.timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};
	
	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */
	
	Request.prototype.withCredentials = function(){
	  this._withCredentials = true;
	  return this;
	};
	
	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var query = this._query.join('&');
	  var timeout = this._timeout;
	  var data = this._formData || this._data;
	
	  // store callback
	  this._callback = fn || noop;
	
	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;
	
	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }
	
	    if (0 == status) {
	      if (self.timedout) return self.timeoutError();
	      if (self.aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };
	
	  // progress
	  var handleProgress = function(e){
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = 'download';
	    self.emit('progress', e);
	  };
	  if (this.hasListeners('progress')) {
	    xhr.onprogress = handleProgress;
	  }
	  try {
	    if (xhr.upload && this.hasListeners('progress')) {
	      xhr.upload.onprogress = handleProgress;
	    }
	  } catch(e) {
	    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	    // Reported here:
	    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	  }
	
	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }
	
	  // querystring
	  if (query) {
	    query = request.serializeObject(query);
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	
	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }
	
	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;
	
	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }
	
	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }
	
	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }
	
	  // send stuff
	  this.emit('request', this);
	
	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};
	
	
	/**
	 * Expose `Request`.
	 */
	
	request.Request = Request;
	
	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};
	
	request['del'] = del;
	request['delete'] = del;
	
	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	if (true) {
	  module.exports = Emitter;
	}
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	
	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */
	
	module.exports = function(arr, fn, initial){  
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3
	    ? initial
	    : arr[idx++];
	
	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }
	  
	  return curr;
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(21);
	
	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};
	
	/**
	 * Force given parser
	 *
	 * Sets the body parser no matter type.
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};
	
	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};
	
	/**
	 * Faux promise support
	 *
	 * @param {Function} fulfill
	 * @param {Function} reject
	 * @return {Request}
	 */
	
	exports.then = function then(fulfill, reject) {
	  return this.end(function(err, res) {
	    err ? reject(err) : fulfill(res);
	  });
	}
	
	/**
	 * Allow for extension
	 */
	
	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}
	
	
	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};
	
	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */
	
	exports.getHeader = exports.get;
	
	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};
	
	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};
	
	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {
	  this._getFormData().append(name, val);
	  return this;
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isObject(obj) {
	  return null != obj && 'object' == typeof obj;
	}
	
	module.exports = isObject;


/***/ },
/* 22 */
/***/ function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */
	
	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }
	
	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }
	
	  return new RequestConstructor(method, url);
	}
	
	module.exports = request;


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = {
	    post: /**
	 * Make a X-Domain request to url and callback.
	 *
	 * @param url {String}
	 * @param method {String} HTTP verb ('GET', 'POST', 'DELETE', etc.)
	 * @param data {String} request body
	 * @param callback {Function} to callback on completion
	 * @param errback {Function} to callback on error
	 */
	    function xdr(url, method, callback) {
	        var req;
	
	        if (XMLHttpRequest) {
	            req = new XMLHttpRequest();
	
	            if ('withCredentials' in req) {
	                req.open(method, url, true);
	                req.onerror = function(e){callback(e, null);};
	                req.onreadystatechange = function () {
	                    if (req.readyState === 4) {
	                        if (req.status >= 200 && req.status < 400) {
	                            callback(null,req.responseText);
	                        } else {
	                            callback(new Error('Response returned with non-OK status'));
	                        }
	                    }
	                };
	                return req;
	            }
	        } else if (XDomainRequest) {
	            req = new XDomainRequest();
	            req.open(method, url);
	            req.onerror = function(e){callback(e, null);};
	            req.onload = function () {
	                callback(null,req.responseText);
	            };
	            return req;
	        } else {
	            throw new Error('CORS not supported');
	        }
	    }
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var user = __webpack_require__(9);
	var experiments = {};
	module.exports = {
		defineExperiment : function(name, percentage){
	        if (typeof percentage === 'boolean'){
	            if (percentage) experiments[name] = percentage;    
	        } else 
			experiments[name] = (user.getUserHash() % 100) <= percentage;
		},
		isExperiment : function(name){
			var exp = experiments[name];
			return !!exp;
		},
		clearExperiments : function(){
			experiments = {};	
		},
		experimentsLive : function(){
			var result = [];
			for (var exp in experiments) {
				if (experiments.hasOwnProperty(exp)) {
					if (experiments[exp]) result.push(exp);				
				}
			}
			return result.join('.');
		},
		MINI_AJAX : 'miniAjax'	
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = {
	 
	    formatDateTime: function (time) {
	        function pad(number) {
	            if (number < 10) {
	                return '0' + number;
	            }
	            return number;
	        }
	        function timezone(time) {
	            var hours = pad(Math.abs(Math.floor(time / 60)));
	            var minutes = pad(Math.abs(time % 60));
	            var sign = time > 0 ? '-' : '+';
	            return sign + hours + ':' + minutes;
	        }
	
	        return '' + time.getFullYear() +
	            '-' + pad(time.getMonth() + 1) +
	            '-' + pad(time.getDate()) +
	            'T' + pad(time.getHours()) +
	            ':' + pad(time.getMinutes()) +
	            ':' + pad(time.getSeconds()) +
	            '.' + (time.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
	            timezone(time.getTimezoneOffset());
	    }
	
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var features = __webpack_require__(24);
	var major = 1,
		minor = 1,
		build = 77;
	module.exports = {
		major : major,
		minor: minor,
		build: build,
		version : function(){
			var experiments = '-'+features.experimentsLive();
			if (experiments === '-') experiments = '';
			return [major, minor, build].join('.') + experiments;}
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var session = __webpack_require__(7);
	var microdata = __webpack_require__(28);
	var autoTrack = __webpack_require__(6);
	var debug = __webpack_require__(8);
	var event = __webpack_require__(30);
	var server = __webpack_require__(16);
	var Cookies = __webpack_require__(10);
	var parseuri = __webpack_require__(5);
	var user = __webpack_require__(9);
	var getCampaign = __webpack_require__(31);
	var getReferrer = __webpack_require__(32);
	var browser = __webpack_require__(2);
	
	var postboxMessages = ['product.viewed', 'product.interest', 'customer.account.provided', 'order.reviewed', 'order.delivery.selected', 'purchase.completed', 'payment.failed', 'product.carted', 'product.uncarted', 'product.unavailable', 'product.searched'];
	
	module.exports = function inbox(transport) {
	    var serviceProviders = [];
	    var sessionResumed = false;
	    return function () {
	        try {
	            if (!Cookies.enabled) return; // let's avoid browsers without cookies for now
	
	            if (arguments[0] == 'session') {
	                session.customSession(arguments[1], arguments[2], arguments[3])
	                return;
	            }
	
	            if (arguments[0] == 'connectedPartners') {
	                autoTrack.links(arguments[1]);
	                return;
	            }
	            if (arguments[0] == 'serviceProviders') {
	                serviceProviders = arguments[1];
	                return;
	            }
	            if (arguments[0] == 'tenantId') {
	                browser.window.asaId = arguments[1];
	                return;
	            }
	            if (arguments[0] == 'debug') {
	                debug.setDebugMode(arguments[1]);
	                return;
	            }
	
	            if (arguments[0] == 'transformer') {
	                microdata.setMapper(arguments[1]);
	                return;
	            }
	
	            var campaign = getCampaign(browser.document.location, browser.document.referrer);
	            var referrer = getReferrer(browser.document.location, browser.document.referrer, serviceProviders);
	            if (!session.hasSession()) {
	                debug.log('no session, starting a new one');
	                session.createSession({ campaign: campaign, referrer: referrer });
	                sessionResumed = true;
	                transport(event.package('sessionStarted', { newBrowser: user.getAndResetNewUserStatus() }));
	            } else {
	                var referrerAuth = parseuri(browser.document.referrer).authority;
	                var currentAuth = parseuri(browser.document.location).authority;
	                    if ((referrerAuth != currentAuth && serviceProviders.indexOf(referrerAuth) === -1)) {
	                        session.updateTimeout({ campaign: campaign, referrer: referrer });
	                        debug.log('session resumed');
	                        sessionResumed = true;
	                        transport(event.package('sessionResumed'));
	                    }
	            }
	            
	            if (postboxMessages.indexOf(arguments[0]) !== -1) {
	                transport(event.newpackage.apply(event, arguments));
	            } else
	                transport(event.package.apply(event, arguments));
	        } catch (e) {
	            debug.forceLog('inbox exception:', e);
	            server.submitError(e, { location: 'processing inbox message', arguments: arguments });
	        }
	    };
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// var jq = $;
	var jq = __webpack_require__(29);
	var debug = __webpack_require__(8);
	
	var collectReferencedProperties = function (element, item) {
		var refString = element.attr('itemref');
		if (typeof refString !== 'undefined') {
			var refs = refString.split(' ');
			for (var i = 0; i < refs.length; i++) {
				var ref = refs[i];
				var refItem = jq('#' + ref);
				if (refItem.length === 1){
					collectProperties(refItem.get(0), item);
				}
				else {
					debug.log('missing metadata element', ref);
				}
			}
		}
	};
	
	var collectComplexProperty = function (element) {
		var item = {
			"type": element.attr("itemtype"),
			"properties": {}
		};
		collectReferencedProperties(element, item);
		collectProperties(element, item);
		return item;
	};
	
	var collectSimpleProperty = function (el) {
		var tag = el.prop('tagName');
		switch (tag) {
			case 'TIME': return el.attr('datetime');
			case 'A':
			case 'LINK':
				return el.attr('href');
			default:
				return el.prop("content") || el.text() || el.attr("src");
		}
	
	};
	
	var collectProperties = function (el, item) {
		el.children().each(function (_, c) {
			var child = jq(c);
			var prop = child.attr('itemprop');
			if (typeof prop === 'string') {
				if (typeof child.attr('itemscope') !== 'undefined') {
					item.properties[prop] = collectComplexProperty(child);
				} else {
					item.properties[prop] = collectSimpleProperty(child);
				}
			}
	
			if (typeof child.attr('itemscope') == 'undefined') {
				collectProperties(child, item);
			}
		});
	};
	
	var findTopLevelItems = function (el) {
		if (!el) return undefined; 
		var items = [];
		if (typeof el === 'string') { el = jq('#'+el).get(0); }
		else if (typeof el === 'object' && typeof el.tagName === 'string') { el = jq(el); }
		else return {};
	
		var processElement = function (e) {
			var el = jq(e);
			var itemScope = el.attr('itemscope');
			var itemProp = el.attr('itemprop');
			if (typeof itemScope !== 'undefined') {
				if (typeof itemProp !== 'undefined') {
					return;
				} else {
					items.push(theOneMapper(collectComplexProperty(el), el));
				}
			} else {
				el.children().each(function (_, c) {
					processElement(c);
				});
			}
		};
	
		processElement(el);
	
		if (items.length === 0) return {};
		if (items.length === 1) return items[0];
		return {'__items' : items};
	};
	
	var extractFromHead = function () {
		var meta = {};
		jq('head > meta[property^="og:"]').each(function () { var m = jq(this); meta[m.attr('property')] = m.attr('content'); });
		jq('head > meta[name="keywords"]').each(function () { var m = jq(this); meta["keywords"] = m.attr('content'); });
		return theOneMapper(meta);
	};
	var noMapper = function(m) {return m;};
	var theOneMapper = noMapper;
	var callbackWrapper = function callbackWrapper(cb){
		return function(meta, el){
			try{
				return cb(meta, el);
			} catch(e){
				return meta;
			}
		}
	}
	module.exports = {
		extract: findTopLevelItems,
		extractFromHead: extractFromHead,
		setMapper : function(mapper){
			theOneMapper = callbackWrapper(mapper);
		},
		noMapper : noMapper
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	
	// Prototype of our jQuery killer ;)
	function DOMElement() {
	}
	
	DOMElement.prototype.text = function text() {
	    return this._element.textContent;
	};
	
	DOMElement.prototype.attr = function attr(name) {
	    // emulating the jQuery behaviour
	    var attrValue = this._element.getAttribute('' + name);
	    if (attrValue === null) return undefined;
	    else
	        return attrValue;
	};
	
	DOMElement.prototype.prop = function prop(name) {
	    return this._element[name];
	};
	
	DOMElement.prototype.children = function children() {
	
	    var c = this._element.children,
	        $doms = [],
	        i, n = c.length;
	
	    for (i = 0; i < n; i++)
	        $doms[i] = $DOM(c[i]);
	
	    return new DOMElements($doms);
	};
	
	function DOMElements(els) {
	    this._els = els;
	    this.length = els.length;
	}
	
	DOMElements.prototype.each = function each(callback) {
	    for (var i = 0; i < this._els.length; i++) {
	        var element = this._els[i];
	        callback.call(element, i, element);
	    }
	};
	
	DOMElements.prototype.get = function get(index) {
	    return this._els[index];
	};
	
	// query parameter is either an element id or a css-style selector
	var $DOM = module.exports = function $DOM(query) {
	
	    if (!query || !(typeof query === 'string' || query instanceof Element || query instanceof DOMElement || query instanceof DOMElements)) {
	        throw new Error('Invalid argument provided:' + query);
	    }
	
	    if (query instanceof DOMElement || query instanceof DOMElements) return query;
	
	    if (query instanceof Element) {
	        var wrapper = new DOMElement();
	        wrapper._element = query;
	        return wrapper;
	    }
	
	    query = ('' + query).trim();
	
	    var elem, elems = [], i, n;
	
	    try {
	        if (query[0] === '#') {         
	            elem = document.getElementById(query.substr(1));
	            if (elem) elem = [elem]; else elem = [];
	        } else {
	            elem = document.querySelectorAll(query);
	        }
	        n = elem.length;
	
	        for (i = 0; i < n; i++)
	            elems.push($DOM(elem[i]));
	
	        return new DOMElements(elems);
	    } catch (exception) {
	        throw new Error('Invalid selector: ' + query);
	    }
	};
	


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var microdata = __webpack_require__(28);
	var session = __webpack_require__(7);
	var info = __webpack_require__(26);
	var user = __webpack_require__(9);
	var _ = __webpack_require__(15);
	var parseUri = __webpack_require__(5);
	var Cookies = __webpack_require__(10);
	var formatting = __webpack_require__(25);
	var getCampaign = __webpack_require__(31);
	var browser = __webpack_require__(2);
	
	var DOMMeta = function (o) {
	    if (o.length < 2) return false;
	    return (typeof o[1] === 'object' && typeof o[1].tagName === 'undefined') ? o[1] : false;
	};
	
	var pageview = function () {
	    var title = browser.document.title;
	    var location = browser.window.location.protocol + '//' + browser.window.location.host + browser.window.location.pathname + browser.window.location.hash + browser.window.location.search;
	    return { type: 'pageview', location: location, title: title };
	};
	
	var sectionentered = function (section, page) {
	    return { type: 'section_entered', section: section };
	};
	
	var custom = function (event) {
	    var baseEvent = pageview();
	    baseEvent.type = 'custom';
	    baseEvent.event = event;
	    return baseEvent;
	};
	
	var gatherMetaInfo = function gatherMetaInfo(a) {
	    var event = a[0];
	    var eventBody = {};
	    if (event) {
	        switch (event.trim()) {
	            case 'pageview':
	                eventBody = pageview.apply(null, [].slice.call(a, 1));
	                break;
	            case 'sectionentered':
	                eventBody = sectionentered.apply(null, [].slice.call(a, 1));
	                break;
	            default:
	                eventBody = custom.apply(null, a);
	        }
	        return eventBody;
	    }
	    throw new Error('Upsi! There is something wrong with this event:', a);
	};
	
	
	var gatherSystemInfo = function (e) {
	    var sess = session.getSession();
	    e.t = formatting.formatDateTime(new Date());
	    e.session = sess.id;
	    e.referrer = sess.referrer || '';
	    var campaign = sess.campaign;
	    if (campaign) e.campaign = campaign;
	    e.uid = user.getUserId();
	    var partnerId = browser.window.sessionStorage.getItem('__as.partner_id');
	    var partnerSId = browser.window.sessionStorage.getItem('__as.partner_sid');
	    if (partnerId) {
	        e.partner_id = partnerId;
	    }
	    if (partnerSId) {
	        e.partner_sid = partnerSId;
	    }
	    e.tenant_id = browser.window.asaId;
	    e.v = info.version();
	    return e;
	};
	
	var postboxEvents = function(type, e, meta){
	    var defaultEventInfo = {
	        "type" : type,
	        "occurred" : meta.t,
	        "origin" : browser.window.location.host,
	        "user" : {
	            "did" : meta.uid,
	            "sid" : meta.session
	        },
	        "page" : {
	            "url" : browser.window.location.protocol + '//' + browser.window.location.host + browser.window.location.pathname + browser.window.location.hash + browser.window.location.search,
	            "referrer" : meta.referrer
	        },
	        "v" : meta.v,
	        "campaign" : meta.campaign,
	        "tenant" : meta.tenant_id
	    };
	    if (meta.partner_id) defaultEventInfo.partnerId = meta.partner_id;
	    if (meta.partner_sid) defaultEventInfo.partnerSId = meta.partner_sid;
	    return _.override(defaultEventInfo, e);
	}
	module.exports = {
	    newpackage: function newpackages(eventName, eventInfo, extra) {
	        var meta = gatherMetaInfo(arguments);
	        meta = gatherSystemInfo(meta);
	        return postboxEvents(eventName, eventInfo, meta);
	    },
	    package: function (eventname, domElement, extra) {
	
	        var event = gatherMetaInfo(arguments);
	        event = gatherSystemInfo(event);
	        // if (arguments[0] == 'pageview') {
	        //     return null;
	        // } else
	        if (arguments[0] == 'sessionStarted') {
	            event.meta = microdata.extractFromHead();
	            if (typeof arguments[1] === 'object') {
	                event.meta = _.override(event.meta, arguments[1]);
	            }
	        } else
	                if (arguments[0] == 'itemview') {
	                    event.meta = DOMMeta(arguments) || microdata.extract(arguments[1]);
	                } else
	                    if (arguments[0] == 'sectionentered') {
	                        event.meta = DOMMeta(arguments) || microdata.extract(arguments[1]);
	                    } else {
	                        var meta = undefined;
	                        if (typeof domElement === 'string' || (typeof domElement === 'object' && typeof domElement.tagName !== 'undefined')) {
	                            meta = microdata.extract(domElement);
	                        } else
	                            if (typeof extra === 'undefined' && typeof domElement === 'object') {
	                                extra = domElement;
	                                domElement = null;
	                            }
	                        meta = _.override(meta, extra);
	                        if (meta !== undefined) event.meta = meta;
	                    }
	        return event;
	    }
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var parseUri = __webpack_require__(5);
	var browser = __webpack_require__(2);
	module.exports = function getCampaign(location, referrer) {
	    var campaignKeys;
	    referrer = parseUri(referrer);
	    location = parseUri(location);
	    if (referrer.queryKey && referrer.queryKey['utm_campaign'])
	        campaignKeys = campaignKeys || referrer.queryKey;
	
	    if (location.queryKey && location.queryKey['utm_campaign'])
	        campaignKeys = campaignKeys || location.queryKey;
	
	    if (campaignKeys) {
	        var campaign = {};
	        if (campaignKeys.utm_campaign) campaign.campaign = campaignKeys.utm_campaign;
	        if (campaignKeys.utm_source) campaign.source = campaignKeys.utm_source;
	        if (campaignKeys.utm_medium) campaign.medium = campaignKeys.utm_medium;
	        if (campaignKeys.utm_term) campaign.term = campaignKeys.utm_term;
	        if (campaignKeys.utm_content) campaign.content = campaignKeys.utm_content;
	        return campaign;
	    }
	    var utmKeys = ['utm_medium','utm_source','utm_campaign','utm_content','utm_term'];
	
	    var __as__campagin = {};
	    utmKeys.forEach(function (utm_key) {
	        var utm_value = browser.window.sessionStorage.getItem('__as.' +  utm_key);
	        if (utm_value) {
	            __as__campagin[utm_key] = utm_value;
	        }
	    });
	    if (Object.keys(__as__campagin).length) {
	        var asCampaign = {};
	        if (__as__campagin.utm_campaign) asCampaign.campaign = __as__campagin.utm_campaign;
	        if (__as__campagin.utm_source) asCampaign.source = __as__campagin.utm_source;
	        if (__as__campagin.utm_medium) asCampaign.medium = __as__campagin.utm_medium;
	        if (__as__campagin.utm_term) asCampaign.term = __as__campagin.utm_term;
	        if (__as__campagin.utm_content) asCampaign.content = __as__campagin.utm_content;
	        return asCampaign;
	    }
	    return null;
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var parseuri = __webpack_require__(5);
	module.exports = function(location, referrer, serviceProviders) {
	    if (referrer && referrer.length > 0) {
	        var referrerAuth = parseuri(referrer).authority;
	        var currentAuth = parseuri(location).authority;
	        if (referrerAuth != currentAuth && serviceProviders.indexOf(referrerAuth) === -1) {
	            return referrer;
	        }
	    }
	    return null;
	}
	


/***/ }
/******/ ]);
//# sourceMappingURL=asa.js.map