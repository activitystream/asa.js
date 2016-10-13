var session = require('./session');
var parseUri = require('./parseuri');
var browser = require('./browser');

module.exports = {
	sections: function () {
		var locationHashChanged = function (oldHash, newHash) {
			asa('sectionentered', newHash.substr(1));
		};
		var storedHash = '';
		browser.window.setInterval(function () {
			if (browser.window.location.hash != storedHash) {
				var newHash = browser.window.location.hash;
				locationHashChanged(storedHash, newHash);
				storedHash = newHash;
			}
		}, 100);
	},

	links: function (domains) {
		var domainsTracked = domains;
		var tracker = function (ev) {
			var href = ev.target.href;
			if (href) {
				var destination = parseUri(href);
				if (domainsTracked.indexOf(destination.authority) > -1) {
                    if (!destination.queryKey['__asa']){
                        var alreadyHasParams = ev.target.href.indexOf('?') !== -1;
                        href = href + (alreadyHasParams ? '&' : '?') + '__asa=' + encodeURIComponent(browser.window.asaId+'|'+session.getSession().id);
                        ev.target.href = href;
                    }
				}
			}
		};
		browser.document.addEventListener('mousedown', tracker);
		browser.document.addEventListener('keyup', tracker);
		browser.document.addEventListener('touchstart', tracker);
	}
};