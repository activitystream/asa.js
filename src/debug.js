var debugMode = false;
var noLog = function noLog() { };
var doLog = function doLog() {
	console.log.apply(console, arguments);
};
var me = module.exports = {
	log: noLog,
	setDebugMode: function (on) {
		me.log = on ? doLog : noLog;
	}
}