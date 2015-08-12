(function() {
	var core = require('./asa');
	var session = require('./session');
	var parseUri = require('./parseuri');
	
	var updatePartnerInfo = function (){
		var partnerIdKey = '__as.partner_id';
		var partnerSIdKey = '__as.partner_sid';
		var uri = parseUri(window.location.href);
		var partnerId = uri.queryKey.__asa_partner_id;
		var partnerSId = uri.queryKey.__asa_partner_sid;
		if (partnerId){
			window.sessionStorage.setItem(partnerIdKey, uri.queryKeys.__asa_partner_id);				
		} else {
			window.sessionStorage.removeItem(partnerIdKey);
		}
		if (partnerSId){
			window.sessionStorage.setItem(partnerSIdKey, uri.queryKeys.__asa_partner_sid);				
		} else {
			window.sessionStorage.removeItem(partnerSIdKey);
		}
	};
	
	var setPartnerInfo = function(){
		var referrer = parseUri(document.referrer).authority;
		var currentHost = parseUri(window.location.origin).authority;
		if (referrer != currentHost){
			updatePartnerInfo()
		}
	}
	
	var autoTrackSections = function(){
		var locationHashChanged = function(oldHash, newHash) {
			asa('sectionentered', newHash.substr(1));
		}
		var storedHash = window.location.hash;
		window.setInterval(function () {
			if (window.location.hash != storedHash) {
				var newHash = window.location.hash;
				locationHashChanged(storedHash, newHash);
				storedHash = newHash;
			}
		}, 100);			
	}
	
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
	
	setPartnerInfo();	
	autoTrackSections();	
})();
