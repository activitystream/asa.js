(function() {
	var core = require('./asa');
	var session = require('./session');
	var partner = require('./partner');	
	var autoTrack = require('./auto_track');
	
	var inbox = function inbox(){
		session.extendSession();
		var event = core.gatherMetaInfo(arguments);
		console.log('got: ', arguments, ', which generated:', event);
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
	autoTrack.links();
})();
