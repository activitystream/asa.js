var microdata = require('./microdata');
var session = require('./session');
var info = require('./version');
var _ = require('./utils');

var explicitMeta = function (o) {
	if (o.length < 2) return false;
	return (typeof o[1] === 'object' && typeof o[1].tagName === 'undefined') ? o[1] : false;
};

var pageview = function () {
	var title = document.title;
	var location = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.hash + window.location.search;
	var page = window.location.pathname + window.location.search;
	return { type: 'pageview', page: page, location: location, title: title };
};

var sectionentered = function (section, page) {
	page = page || window.location.pathname + window.location.hash + window.location.search;
	return { type: 'section_entered', page: page, section: section };
};

var custom = function (event) {
	return { type: 'custom', event: event };
};

var gatherMetaInfo = function gatherMetaInfo(a) {
	var event = a[0];
	var eventBody = {};
	if (event) {
		switch (event.trim()) {
			case 'pageview':
				eventBody = pageview.apply(null, [].slice.call(a, 1));
				break;
			case 'sectionentered':
				eventBody = sectionentered.apply(null, [].slice.call(a, 1));
				break;
			default:
				eventBody = custom.apply(null, a);
		}
		return eventBody;
	}
	throw new Error('Upsi! There is something wrong with this event:', a);
};

var gatherSystemInfo = function (e) {
	e.t = 1 * new Date();
	e.session = session.getSessionId();
	var partnerId = window.sessionStorage.getItem('__as.partner_id');
	var partnerSId = window.sessionStorage.getItem('__as.partner_sid');
	if (partnerId) {
		e.partner_id = partnerId;
	}
	if (partnerSId) {
		e.partner_sid = partnerSId;
	}
	e.tenant_id = window.asaId;
	e.v = info.version();
	return e;
};

module.exports = {
	package: function () {

		var event = gatherMetaInfo(arguments);
		event = gatherSystemInfo(event);
		if (arguments[0] == 'pageview') {
			event.meta = microdata.extractFromHead();
			if (typeof arguments[1] === 'object'){
				_.override(event.meta, arguments[1]);
			}
		} else
			if (arguments[0] == 'itemview') {
				event.meta = explicitMeta(arguments) || microdata.extract(arguments[1]);
			} else
				if (arguments[0] == 'sectionentered') {
					event.meta = explicitMeta(arguments) || microdata.extract(arguments[1]);
				} else {
					event.meta = explicitMeta(arguments) || undefined;
				}
		return event;
	}
};