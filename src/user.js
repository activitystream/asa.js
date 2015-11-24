var cookies = require('./cookies');
var Cookies = require('cookies-js');
var hash = require('./domain_hash');
var randomness = require('./randomness');
var USER_ID_COOKIE = '__as_user';
var generateUserId = function () {
	return hash(window.location.host) + '.' + hash('' + randomness.getNumber());
};
var setUserId = function() {
    var userId = generateUserId();
    cookies.setItem(USER_ID_COOKIE, userId, Infinity, '/');
    return userId;    
}
var setUserId2 = function() {
    var userId = generateUserId();
    cookies.setItem(USER_ID_COOKIE, userId, Infinity, '/');
    return userId;    
}
var getUserId = function () {
	if (!cookies.hasItem(USER_ID_COOKIE)) {
        return setUserId();
	}

    var userId = cookies.getItem(USER_ID_COOKIE);
    if (userId.length > 25) {
        // the old, more verbose user ids, upgrading them
        return setUserId(); 
    }

	return cookies.getItem(USER_ID_COOKIE);
};

module.exports = {
	getUserId: getUserId,
	getDomainId: function () {
		return hash(window.location.host);
	},
	getUserHash: function () {
		return parseInt(getUserId().split('.')[1], 16);
	}
};