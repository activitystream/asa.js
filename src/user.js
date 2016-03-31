// var cookies = require('./cookies');
var Cookies = require('cookies-js');
var domainHash = require('./domain_hash').domainHash;
var userHash = require('./domain_hash').userHash;
var randomness = require('./randomness');
var USER_ID_COOKIE = '__as_user';
var window = require('./browser').window;
var document = require('./browser').document;

var generateUserId = function () {
	return domainHash(window.location.host) + '.' + userHash('' + randomness.getNumber());
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
		return domainHash(window.location.host);
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