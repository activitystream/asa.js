var features = require('./features');
var major = 1,
	minor = 1,
	build = 29;
module.exports = {
	major : major,
	minor: minor,
	build: build,
	version : function(){
		var experiments = '-'+features.experimentsLive();
		if (experiments === '-') experiments = '';
		return [major, minor, build].join('.') + experiments;}
};