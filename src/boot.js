var browser = require('./browser');
var runBootSequence = function(bootSequence){
    bootSequence = bootSequence || [];
    if (!(bootSequence instanceof Array)) bootSequence = [bootSequence];

    for (var i = 0; i < bootSequence.length; i++) {
        browser.window.asa.apply(null, bootSequence[i]);
    }
};

require('./polyfills')();

module.exports = function(bootSequence){
    // var DNT = navigator.doNotTrack || navigator.msDoNotTrack || browser.window.doNotTrack;
    // if (DNT && (DNT === 'yes' || DNT.charAt(0) === '1')) return;
	var partner = require('./partner');
	var autoTrack = require('./auto_track');
	var debug = require('./debug');
	var inbox = require('./inbox');
	var server = require('./server');
	var features = require('./features');

	try {
		var pendingEvents = [];
		if ((typeof browser.window.asa !== 'undefined') && (typeof browser.window.asa.q !== 'undefined')) {
			pendingEvents = browser.window.asa.q;
		}

		browser.window.asa = inbox(server.submitEvent);

		// features.defineExperiment(features.MINI_AJAX, 10);
        partner.setPartnerInfo();
        runBootSequence(bootSequence);

		for (var i = 0; i < pendingEvents.length; i++) {
			browser.window.asa.apply(null, pendingEvents[i]);
		}

		// autoTrack.sections();
	} catch (e) {
		debug.forceLog('exception during init: ', e);
        server.submitError(e, {location : 'boot script'});
	}
}
