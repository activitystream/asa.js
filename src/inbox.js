var session = require('./session');
var microdata = require('./microdata');
var autoTrack = require('./auto_track');
var debug = require('./debug');
var event = require('./event');

module.exports = function inbox(transport) {
	return function () {
		try {
			session.extendSession();
			if (arguments[0] == 'connectedPartners') {
				autoTrack.links(arguments[1]);
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
			if (arguments[0] == 'session') {
				session.customSession(arguments[1], arguments[2])
				return;
			}
			
			transport(event.package.apply(event, arguments));
		} catch (e) {
			debug.forceLog('inbox exception:', e);
		}
	};
};
