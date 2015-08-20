var major = 1,
	minor = 1,
	build = 1;
module.exports = {
	major : major,
	minor: minor,
	build: build,
	version : function(){return [major, minor, build].join('.');}
};