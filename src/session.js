var debug = require('./debug');
var user = require('./user');
var randomness = require('./randomness');
var hash = require('./domain_hash').sessionHash;
var Cookies = require('./cookies');
var _ = require('./utils');


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
            return Cookies.setItem(id, value, false, '/');
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
// SESSION_EXPIRE_TIMEOUT = 30 * 60;
var SESSION_COOKIE_NAME = '__asa_session';
var builtinSessionManager = {
    hasSession: function() {
        var item = sessionStore.hasItem(SESSION_COOKIE_NAME);
        return item && JSON.parse(item).t > (1 * new Date());
    },

    createSession: function(sessionData) {
        sessionStore.setItem(SESSION_COOKIE_NAME, JSON.stringify(_.override({ id: user.getDomainId() + '.' + hash(user.getUserId() + '.' + randomness.getNumber()), t: ((1 * new Date()) + SESSION_EXPIRE_TIMEOUT) }, sessionData)));
    },

    getSession: function() {
        return JSON.parse(sessionStore.getItem(SESSION_COOKIE_NAME));
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
    resetSessionMgmt : function resetSessionMgmt() {
        sessionManager = builtinSessionManager;
    }
};