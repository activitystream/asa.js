var runBootSequence = function(bootSequence){
    bootSequence = bootSequence || [];
    if (!(bootSequence instanceof Array)) bootSequence = [bootSequence];

    for (var i = 0; i < bootSequence.length; i++) {
        window.asa.apply(null, bootSequence[i]);
    }
};

require('./polyfills')();

module.exports = function(bootSequence){
    // var DNT = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
    // if (DNT && (DNT === 'yes' || DNT.charAt(0) === '1')) return;
	var partner = require('./partner');
	var autoTrack = require('./auto_track');
	var debug = require('./debug');
	var inbox = require('./inbox');	
	var server = require('./server');
	var features = require('./features');

	try {
		var pendingEvents = [];
		if ((typeof window.asa !== 'undefined') && (typeof window.asa.q !== 'undefined')) {
			pendingEvents = window.asa.q;
		}

		window.asa = inbox(server.submitEvent);

		// features.defineExperiment(features.MINI_AJAX, 10);
        
        runBootSequence(bootSequence);

		for (var i = 0; i < pendingEvents.length; i++) {
			window.asa.apply(null, pendingEvents[i]);
		}

		partner.setPartnerInfo();
		// autoTrack.sections();
	} catch (e) {
		debug.forceLog('exception during init: ', e);
        server.submitError(e, {location : 'boot script'});
	}    
}