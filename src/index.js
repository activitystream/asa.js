(function () {
	var partner = require('./partner');
	var autoTrack = require('./auto_track');
	var debug = require('./debug');
	var inbox = require('./inbox');	
	var core = require('./server');
	var features = require('./features');

	try {
		var pendingEvents = [];
		if ((typeof window.asa !== 'undefined') && (typeof window.asa.q !== 'undefined')) {
			pendingEvents = window.asa.q;
		}

		window.asa = inbox(core.submitEvent);

		// features.defineExperiment(features.MINI_AJAX, 10);

		for (var i = 0; i < pendingEvents.length; i++) {
			window.asa.apply(null, pendingEvents[i]);
		}

		partner.setPartnerInfo();
		autoTrack.sections();
	} catch (e) {
		debug.forceLog('exception during init: ', e);
	}
})();
