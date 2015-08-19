var r = require('superagent');
var debug = require('./debug');

var pendingSubmission = [], done = true;
var batchIntervalHandler;
// var postalAddress = 'http://localhost:6502/log';
var postalAddress = '//inbox.activitystream.com/asa';

var submitNow = function(ev){
	done = false;
	if (!(ev instanceof Array)) ev = [ev];
	var packet = {
		ev : ev,
		t: 1 * new Date()
	};
	debug.log('submitting event: ', ev);
	r
		.post(postalAddress)
		.set('Content-Type', 'application/json')
		.send(packet)
		.end(function (err, res) {
			if (err) {
				debug.log('error on server', err);
			} else {
				pendingSubmission.splice(0, ev.length);
				debug.log('server got it');
			}
			done = true;
		});
};
module.exports = {
	submitEvent: submitNow,
	batchEvent: function(e){
		pendingSubmission.push(e);
	},
	batchOn: function(){
		batchIntervalHandler = setInterval(function batchProcessor(){
			if (pendingSubmission.length > 0 && done) {
				var batchSize = Math.min(pendingSubmission.length, 10);
				submitNow(pendingSubmission.slice(0, batchSize));
			}
		}, 400);
	},
	batchOff: function(){
		if (!batchIntervalHandler) {
			debug.log('cannot batch off, it is not on');
		} else {
			clearInterval(batchIntervalHandler);			
		} 
	}
};