var r = require('superagent');
var session = require('./session');
var debug = require('./debug');
var info = require('./version');

// var postalAddress = 'http://localhost:6502/log';
var postalAddress = '//inbox.activitystream.com/asa';

module.exports = {
	submitEvent: function submitEvent(e) {
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
		e.v = info.version;
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
	}

};