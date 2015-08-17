(function () {
	var partner = require('./partner');
	var autoTrack = require('./auto_track');
	var debug = require('./debug');
	var inbox = require('./inbox');	

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
