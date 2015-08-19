var core = require('./core');
var microdata = require('./microdata');

var explicitMeta = function (o) {
	if (o.length < 2) return false;
	return (typeof o[1] === 'object' && typeof o[1].tagName === 'undefined') ? o[1] : false;
};

module.exports = {
	package : function(){

			var event = core.gatherMetaInfo(arguments);

			if (arguments[0] == 'pageview') {
				event.meta = explicitMeta(arguments) || microdata.extractFromHead();
			} else
				if (arguments[0] == 'itemview') {
					event.meta = explicitMeta(arguments) || microdata.extract(arguments[1]);
				} else
					if (arguments[0] == 'sectionentered') {
						event.meta = explicitMeta(arguments) || microdata.extract(arguments[1]);
					} else {
						event.meta = explicitMeta(arguments) || undefined;
					}
			return event;
	}
}