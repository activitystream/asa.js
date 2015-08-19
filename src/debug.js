// old ie
if (typeof console === 'undefined') {
	window.console = {};
}
if (typeof console.log === 'undefined'){
	window.console.log = function(){};
}

var noLog = function noLog() { };
var doLog = function doLog() {
	[].unshift.call(arguments, 'asa.js:');
	console.log.apply(console, arguments);
};
var me = module.exports = {
	log: noLog,
	setDebugMode: function (on) {
		me.log = on ? doLog : noLog;
	},
	forceLog:doLog
};