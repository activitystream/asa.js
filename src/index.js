(function () {
	var core = require('./asa');
	var session = require('./session');
	var partner = require('./partner');
	var autoTrack = require('./auto_track');
	var debug = require('./debug');
	var microdata = require('./microdata');
	
	var explicitMeta = function(o){
		if (o.length < 2) return false;
		return (typeof o[1] === 'object' && typeof o[1].tagName === 'undefined') ? o[1] : false; 
	};

	var inbox = function inbox() {
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

			var event = core.gatherMetaInfo(arguments);

			if (arguments[0] == 'pageview') {
				event.meta = explicitMeta(arguments) || microdata.extractFromHead();
			} else
			if (arguments[0] == 'itemview') {
				event.meta = explicitMeta(arguments) || microdata.extract(arguments[1]);
			} else
			if (arguments[0] == 'sectionentered') {
				event.meta = explicitMeta(arguments) || microdata.extract(arguments[1]);
			} else {
				event.meta = explicitMeta(arguments) || undefined;
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
