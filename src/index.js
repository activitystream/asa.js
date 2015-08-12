(function() {
	var core = require('./asa');
	var session = require('./session');
	var partner = require('./partner');	
	var autoTrack = require('./auto_track');
	var debug = require('./debug');
	
	var inbox = function inbox(){
		if (arguments[0] == 'trackLinks'){
			autoTrack.links(arguments[1]);
			return;
		}
		session.extendSession();
		var event = core.gatherMetaInfo(arguments);
		debug.log('got: ', arguments, ', which generated:', event);
		core.submitEvent(event);				
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
