var session = require('./session');
var microdata = require('./microdata');
var autoTrack = require('./auto_track');
var debug = require('./debug');
var event = require('./event');
var server = require('./server');
var Cookies = require('cookies-js');
var parseuri = require('./parseuri');
var user = require('./user');
var getCampaign = require('./campaign');
var getReferrer = require('./referrer');

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
                window.asaId = arguments[1];
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

            if (!session.hasSession()) {
                debug.log('no session, starting a new one');
                var campaign = getCampaign(document.location, document.referrer);
                var referrer = getReferrer(document.location, document.referrer, serviceProviders);
                session.createSession({ campaign: campaign, referrer: referrer });
                sessionResumed = true;
                transport(event.package('sessionStarted', { newBrowser: user.getAndResetNewUserStatus() }));
            } else {
                var campaign = getCampaign(document.location, document.referrer);
                var referrer = getReferrer(document.location, document.referrer, serviceProviders);
                session.updateTimeout({ campaign: campaign, referrer: referrer });
                if (!sessionResumed && ((document.referrer && document.referrer.length > 0) || campaign)) {
                    var referrerAuth = parseuri(document.referrer).authority;
                    var currentAuth = parseuri(document.location).authority;
                    if ((referrerAuth != currentAuth && serviceProviders.indexOf(referrerAuth) === -1) || campaign) {
                        debug.log('session resumed');
                        sessionResumed = true;
                        transport(event.package('sessionResumed'));
                    }
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
