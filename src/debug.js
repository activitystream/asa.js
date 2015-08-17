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