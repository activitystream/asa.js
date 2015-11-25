var debug = require('./debug');
var user = require('./user');
var randomness = require('./randomness');
var hash = require('./domain_hash').sessionHash;


var SESSION_EXPIRE_TIMEOUT = 30 * 60;
// SESSION_EXPIRE_TIMEOUT = 30 * 60;
var SESSION_COOKIE_NAME = '__asa_session';

var persistence = {
    get : function(id){
        try {
            return window.sessionStorage.getItem(id);
        } catch(e){
            throw new Error('Error while trying to get item from session storage:'+e.name+'/'+e.message);
        }
    },
    set : function(id, value){
        try{
            return window.sessionStorage.setItem(id, value);
        } catch(e){
            throw new Error('Error while trying to set item from session storage:'+e.name+'/'+e.message);
        }
    }
}

var store = {
	hasItem: function (name) {
		var item = persistence.get(name);
		return item && JSON.parse(item).t > (1 * new Date());
	},
	getItem: function (name) {
		return JSON.parse(persistence.get(name)).v;
	},
	setItem: function (name, value, timeout) {
		persistence.set(name, JSON.stringify({
			v: value,
			t: (1 * new Date()) + (1000 * timeout)
		}));
	},
	updateTimeout: function (name, timeout) {
		var item = JSON.parse(persistence.get(name));
		store.setItem(name, item.v, timeout);
	}
};

var sessionStore = store;
var ourSessionManager = {
	extendSession: function () {
		if (!sessionStore.hasItem(SESSION_COOKIE_NAME)) {
			debug.log('starting session');
			sessionStore.setItem(SESSION_COOKIE_NAME, user.getDomainId() + '.' + hash(user.getUserId() + '.' + randomness.getNumber()), SESSION_EXPIRE_TIMEOUT);
		} else {
			sessionStore.updateTimeout(SESSION_COOKIE_NAME, SESSION_EXPIRE_TIMEOUT);
		}
	},

	getSessionId: function () {
		return sessionStore.getItem(SESSION_COOKIE_NAME);
	}
    
};
var providedSessionManager = function(getSessionId, extendSession){
    return {
        extendSession: function () {
            if (extendSession) extendSession();
        },
    
        getSessionId: function () {
            return getSessionId();
        }    
    };
};
var sessionManager = ourSessionManager;
module.exports = {
	extendSession: function () {
        sessionManager.extendSession();
	},

	getSessionId: function () {
		return sessionManager.getSessionId();
	},
    customSession : function(getSession, extendSession){
        sessionManager = providedSessionManager(getSession, extendSession);
    }
};