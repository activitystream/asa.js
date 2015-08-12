var session = require('./session');
module.exports = {
	sections: function () {
		var locationHashChanged = function (oldHash, newHash) {
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
	},
	
	links : function(){
		document.addEventListener('mousedown', function(ev){
			var ref = ev.target.href;
			ref = ref + '?__asa_partner_id='+encodeURIComponent(window.asaId)+'&__asa_partner_sid='+encodeURIComponent(session.getSessionId());
			ev.target.href = ref; 
		});
	}
}