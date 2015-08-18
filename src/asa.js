var r = require('superagent');
var session = require('./session');
var debug = require('./debug');

// var postalAddress = 'http://localhost:6502/log';
var postalAddress = '//inbox.activitystream.com/asa';
var submitEvent = function (e) {
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
	debug.log('submitting event: ', e);
	r
		.post(postalAddress)
		.set('Content-Type', 'application/json')
		.send(e)
		.end(function (err, res) {
			if (err) {
				debug.log('error on server', err);
			} else { 
				debug.log('server got it'); 
			}
		});
};

var pageview = function () {
	var title = document.title;
	var location = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.hash + window.location.search;
	var page = window.location.pathname + window.location.search;
	return { type: 'pageview', page: page, location: location, title: title };
};

var sectionentered = function (section, page) {
	page = page || window.location.pathname + window.location.search;
	return { type: 'section_entered', page: page, section: section };
};

var custom = function (event) {
	return { type: 'custom', event: event };
};

module.exports = {
	gatherMetaInfo: function (a) {
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
			eventBody.t = 1 * new Date();
			return eventBody;
		}
		throw new Error('Upsi! There is something wrong with this event:', a);
	},
	submitEvent: submitEvent
};