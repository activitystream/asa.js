var r = require('superagent');
var debug = require('./debug');
var ajax = require('./ajax');
var features = require('./features');
var formatting = require('./formatting');

var pendingSubmission = [], done = true;
var batchIntervalHandler;

var eventPostAddress = '//inbox.activitystream.com/asa';
var errorPostAddress = '//inbox.activitystream.com/asa/error';

var post = function (packet, callback) {
    var request = ajax.post(eventPostAddress, 'POST', callback);
	request.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
	request.send(JSON.stringify(packet));
};

var submitData = function(data, opts, callback){
    opts = opts || {url : eventPostAddress};
	var packet = {
		ev: data,
		t: formatting.formatDateTime(new Date())
	};

	debug.log('submitting data: ', data);
	if (features.isExperiment(features.MINI_AJAX)) {
		post(packet, function (err, res) {
            if (callback) {
                callback(err, res);
            } else {
                if (err) {
                    debug.log('error on server', err);
                } else {
                    debug.log('server got it');
                }
            }
		});

	} else {
		r
			.post(opts.url)
			.set('Content-Type', 'application/json')
			.send(packet)
			.end(function (err, res) {
                if (callback) {
                    callback(err, res);
                } else {
                    if (err) {
                        debug.log('error on server', err);
                    } else {
                        debug.log('server got it');
                    }
                }
			});
	}    
}

var submitEvent = function(ev, callback){
    submitData(ev, {url : eventPostAddress}, callback);
}

var submitError = function(err, callback){
    if (err && (err.code === 22 || err.code === 18)) return;// skipping error 22 and 18 - related to quota storage. it seems related to people browsing in private mode
    submitData(err, {url : errorPostAddress}, callback);
}

var submitNow = function (ev) {
	if (ev instanceof Array){
        for (var i = 0; i < ev.length; i++){
            submitEvent(ev[i]);
        }        
    } else {
        submitEvent(ev);
    }
};

var submitNow2 = function (ev) {
	done = false;
    submitEvent(ev, function(err, res){
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
    submitError: submitError,
	submitEvent: submitNow,
	batchEvent: function (e) {
		pendingSubmission.push(e);
	},
	batchOn: function () {
		batchIntervalHandler = setInterval(function batchProcessor() {
			try {
				if (pendingSubmission.length > 0 && done) {
					var batchSize = Math.min(pendingSubmission.length, 10);
					submitNow2(pendingSubmission.slice(0, batchSize));
				}
			} catch (e) {
				debug.log('exception submitting', e);
			}
		}, 400);
	},
	batchOff: function () {
		if (!batchIntervalHandler) {
			debug.log('cannot batch off, it is not on');
		} else {
			clearInterval(batchIntervalHandler);
		}
	}
};