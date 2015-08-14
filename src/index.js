(function () {
	var core = require('./asa');
	var session = require('./session');
	var partner = require('./partner');
	var autoTrack = require('./auto_track');
	var debug = require('./debug');
	var microdata = require('./microdata');

	var inbox = function inbox() {
		try {
			session.extendSession();

			if (arguments[0] == 'connectedPartners') {
				autoTrack.links(arguments[1]);
				return;
			}
			if (arguments[0] == 'debug') {
				debug.setDebugMode(arguments[1]);
				return;
			}

			var event = core.gatherMetaInfo(arguments);

			if (arguments[0] == 'pageview') {
				event.meta = microdata.extractFromHead();
			}
			if (arguments[0] == 'itemview') {
				event.meta = microdata.extract(arguments[1]);
			}
			if (arguments[0] == 'sectionentered') {
				event.meta = microdata.extract('#' + arguments[1]);
			}

			core.submitEvent(event);
		} catch (e) {
			debug.log('inbox exception:', e);
		}
	};

	try {
		var pendingEvents = [];
		if ((typeof window.asa !== 'undefined') && (typeof window.asa.q !== 'undefined')) {
			pendingEvents = window.asa.q;
		}

		window.asa = inbox;
		for (var i = 0; i < pendingEvents.length; i++) {
			window.asa.apply(null, pendingEvents[i]);
		}

		partner.setPartnerInfo();
		autoTrack.sections();
	} catch (e) {
		debug.log('exception during init: ', e);
	}
})();
