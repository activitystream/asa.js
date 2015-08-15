var cookies = require('./cookies');
var hash = require('./domain_hash');
var randomness = require('./randomness');
var USER_ID_COOKIE = '__as_user';
var generateUserId = function(){
	return hash(window.location.host) + '.' + hash(''+randomness.getNumber());
}
module.exports = {
	getUserId : function(){
		if (!cookies.hasItem(USER_ID_COOKIE)){
			cookies.setItem(USER_ID_COOKIE, generateUserId(), Infinity);
		}
		
		return cookies.getItem(USER_ID_COOKIE);		
	},
	getDomainId : function(){
		return hash(window.location.host);
	}
};