var cookies = require('./cookies.js');
var r = require('superagent');
var session = require('./session');

var submitEvent = function (e) {
	e.session = session.getSessionId();
	if (cookies.hasItem('__asa_partner_id')){
		e.partner_id = cookies.getItem('__asa_partner_id');
	}
	if (cookies.hasItem('__asa_partner_sid')){
		e.partner_sid = cookies.getItem('__asa_partner_sid');
	}
	e.tenant_id = window.asaId;
	console.log('event: ', e);
	r
		.post('http://localhost:6502/log')
		.set('Content-Type', 'application/json')
		.send(e)
		.end();
}

var pageview = function (page, location, title) {
	title = title || document.title;
	location = location || window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search;
	page = page || window.location.pathname + window.location.search;
	return { type: 'pageview', page: page, location: location, title: title };
};

var sectionentered = function (section, page) {
	page = page || window.location.path + window.location.search;
	return { type: 'section_entered', page: page, section: section };
};

var custom = function (event, params) {
	return { type: 'custom', event: event, params: params };
};

module.exports = {
	gatherMetaInfo: function (a) {
		var event = Array.prototype.shift.apply(a, []);
		if (event) {
			switch (event.trim()) {
				case 'pageview': return pageview.apply(null, a);
				case 'sectionentered': return sectionentered.apply(null, a);
				default:
					a.unshift(event);
					return custom.apply(null, a);
			}
		}
		throw new Error('Upsi! There is something wrong with this event:', a);
	},
	submitEvent: submitEvent
}