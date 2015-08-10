(function() {
	var core = require('./asa');
	var inbox = function inbox(){
		core.extendSession();
		var event = core.gatherMetaInfo(arguments);
		console.log('got: ', arguments, ', which generated:', event);
		core.submitEvent(event);				
	};
	var locationHashChanged = function(oldHash, newHash) {
		asa('sectionentered', newHash.substr(1));
	}

	var pendingEvents = [];	
	if (!( typeof window.asa === 'undefined' ) && !( typeof window.asa.q === 'undefined' ) ) {
		pendingEvents = window.asa.q;
	}
	
	window.asa = inbox;
	for (var i = 0; i < pendingEvents.length; i++) {
		window.asa.apply(null, pendingEvents[i]);
	}
	
	var storedHash = window.location.hash;
	window.setInterval(function () {
		if (window.location.hash != storedHash) {
			var newHash = window.location.hash;
			locationHashChanged(storedHash, newHash);
			storedHash = newHash;
		}
	}, 100);	
})();
