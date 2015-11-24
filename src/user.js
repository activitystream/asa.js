var cookies = require('./cookies');
var Cookies = require('cookies-js');
var domainHash = require('./domain_hash').domainHash;
var userHash = require('./domain_hash').userHash;
var randomness = require('./randomness');
var USER_ID_COOKIE = '__as_user';

var generateUserId = function () {
	return domainHash(window.location.host) + '.' + userHash('' + randomness.getNumber());
};

var setUserId = function() {
    var userId = generateUserId();
    cookies.setItem(USER_ID_COOKIE, userId, Infinity, '/');
    return userId;    
}

var getUserId = function () {
	if (!cookies.hasItem(USER_ID_COOKIE)) {
        return setUserId();
	}

    var userId = cookies.getItem(USER_ID_COOKIE);
    if (userId.length > 70 || userId.length < 40) {
        // we need proper migrations here
        return setUserId(); 
    }

	return cookies.getItem(USER_ID_COOKIE);
};

module.exports = {
	getUserId: getUserId,
	getDomainId: function () {
		return domainHash(window.location.host);
	},
	getUserHash: function () {
		return domainHash(getUserId().split('.')[1]);
	}
};