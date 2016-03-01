var debug = require('./debug');
var user = require('./user');
var randomness = require('./randomness');
var hash = require('./domain_hash').sessionHash;
var Cookies = require('./cookies');


var persistence = {
    get : function(id){
        try {
            return Cookies.getItem(id);
        } catch(e){
            throw new Error('Error while trying to get item from session cookie:'+id);
        }
    },
    set : function(id, value){
        try{
            return Cookies.setItem(id, value, false, '/');
        } catch(e){
            throw new Error('Error while trying to set item to session cookie: "'+id+'" <- '+value);
        }
    }
}

var store = {
	hasItem: function (name) {
		var item = persistence.get(name);
		return item;
	},
	getItem: function (name) {
		return persistence.get(name);
	},
	setItem: function (name, value, timeout) {
		persistence.set(name, value);
	},
	updateTimeout: function (name, timeout) {
		var item = persistence.get(name);
		store.setItem(name, item, timeout);
	}
};

var sessionStore = store;
var SESSION_EXPIRE_TIMEOUT = 30 * 60;
// SESSION_EXPIRE_TIMEOUT = 30 * 60;
var SESSION_COOKIE_NAME = '__asa_session';
var builtinSessionManager = {    
    hasSession: function(){
        return sessionStore.hasItem(SESSION_COOKIE_NAME);
    },
    
    createSession: function(){
        sessionStore.setItem(SESSION_COOKIE_NAME, user.getDomainId() + '.' + hash(user.getUserId() + '.' + randomness.getNumber()), SESSION_EXPIRE_TIMEOUT);
    },

	getSessionId: function () {
		return sessionStore.getItem(SESSION_COOKIE_NAME);
	}
    
};
var providedSessionManager = function(hasSessions, getSession, createSession){
    return {
        hasSession: function(){
            return hasSessions();
        },
        
        createSession: function(){
            createSession();
        },

        getSessionId: function () {
            return getSession();
        }
    };
};
var sessionManager = builtinSessionManager;
module.exports = {
	getSessionId: function () {
		return sessionManager.getSessionId();
	},
    hasSession: function(){
        return sessionManager.hasSession();
    },
    createSession: function(){
        sessionManager.createSession();
    },
    customSession : function(hasSessions, getSession, createSession){
        sessionManager = providedSessionManager(hasSessions, getSession, createSession);
    },
    saveInSession: function(name, value){
        store.setItem(name, value);
    },
    getFromSession: function(name){
        return store.getItem(name)
    }
};