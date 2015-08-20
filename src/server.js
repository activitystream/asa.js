var r = require('superagent');
var debug = require('./debug');
var features = require('./features');

var pendingSubmission = [], done = true;
var batchIntervalHandler;

var postalAddress = '//inbox.activitystream.com/asa';

var post = function(packet, callback){
	var request = new XMLHttpRequest();
	request.open('POST', postalAddress, true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			callback(null, request.status);
		} else {
			callback(request.status, null);
		}
	};

	request.onerror = function () {
		callback(1000, null);
	};
	request.send(JSON.stringify(packet));	
	
}
var submitNow = function(ev){
	if (!(ev instanceof Array)) ev = [ev];
	var packet = {
		ev : ev,
		t: 1 * new Date()
	};
	
	debug.log('submitting event: ', ev);
	if (features.isExperiment(features.MINI_AJAX)){
	 post(packet, function(err, _){
		if (err) {
			debug.log('error on server', err);
		} else {
			debug.log('server got it');
		}
	});
		
	} else	{
	  r
		.post(postalAddress)
		.set('Content-Type', 'application/json')
		.send(packet)
		.end(function (err, res) {
			if (err) {
				debug.log('error on server', err);
			} else {
				debug.log('server got it');
			}
		});		
	}	
};
var submitNow2 = function(ev){
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
			try{
				if (pendingSubmission.length > 0 && done) {
					var batchSize = Math.min(pendingSubmission.length, 10);
					submitNow2(pendingSubmission.slice(0, batchSize));
				}
			} catch(e){
				debug.log('exception submitting', e);				
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