var debug = require('./debug');

var SESSION_EXPIRE_TIMEOUT = 30 * 60;
// SESSION_EXPIRE_TIMEOUT = 30 * 60;
var SESSION_COOKIE_NAME = '__asa_session';

var store = {
	hasItem : function (name){
		var item = window.sessionStorage.getItem(name);
		return item && JSON.parse(item).t > (1 * new Date()); 
	},
	getItem : function (name){
		return JSON.parse(window.sessionStorage.getItem(name)).v; 
	},
	setItem : function(name, value, timeout){
		window.sessionStorage.setItem(name, JSON.stringify({
			v : value,
			t : (1 * new Date()) + (1000*timeout)
		}));	
	},
	updateTimeout : function(name, timeout){
		var item = JSON.parse(window.sessionStorage.getItem(name));
		store.setItem(name, item.v, timeout);
	}
};

var sessionStore = store;
module.exports = {
	extendSession : function(){
		if (!sessionStore.hasItem(SESSION_COOKIE_NAME)) {
			debug.log('starting session');
			sessionStore.setItem(SESSION_COOKIE_NAME, ''+Math.random(), SESSION_EXPIRE_TIMEOUT);			
		} else {
			sessionStore.updateTimeout(SESSION_COOKIE_NAME, SESSION_EXPIRE_TIMEOUT);
		}
	},
	
	getSessionId : function(){
		return sessionStore.getItem(SESSION_COOKIE_NAME);		
	},
};