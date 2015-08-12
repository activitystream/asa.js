module.exports = {
	autoTrackSections: function () {
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
	}
}