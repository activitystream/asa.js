(function() {
	var core = require('./asa');
	var session = require('./session');
	var partner = require('./partner');	
	var autoTrack = require('./auto_track');
	var debug = require('./debug');
	var microdata = require('./microdata');
	
	var inbox = function inbox(){
		session.extendSession();
		if (arguments[0] == 'trackLinks'){
			autoTrack.links(arguments[1]);
			return;
		}
		if (arguments[0] == 'debug'){
			debug.setDebugMode(arguments[1]);
			return;
		}
		if (arguments[0] == 'itemview'){
			var metaD = microdata.extract(arguments[1]);
			debug.log('metadata:', metaD);
			return;
		}
		if (arguments[0] == 'sectionentered'){
			var metaD = microdata.extract('#'+arguments[1]);
			debug.log('metadata:', metaD);
			var event = core.gatherMetaInfo(arguments);
			core.submitEvent(event);				
			return;
		}
		debug.log('unhandled message');
		debug.log.apply(null, arguments);
	};

	var pendingEvents = [];	
	if (!( typeof window.asa === 'undefined' ) && !( typeof window.asa.q === 'undefined' ) ) {
		pendingEvents = window.asa.q;
	}
	
	window.asa = inbox;
	for (var i = 0; i < pendingEvents.length; i++) {
		window.asa.apply(null, pendingEvents[i]);
	}
	
	partner.setPartnerInfo();	
	autoTrack.sections();	
})();
