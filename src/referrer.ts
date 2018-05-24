var parseuri = require('./parseuri');
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

