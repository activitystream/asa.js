var core = require('./asa');
var microdata = require('./microdata');

var explicitMeta = function (o) {
	if (o.length < 2) return false;
	return (typeof o[1] === 'object' && typeof o[1].tagName === 'undefined') ? o[1] : false;
};

module.exports = {
	package : function(args){

			var event = core.gatherMetaInfo(args);

			if (args[0] == 'pageview') {
				event.meta = explicitMeta(args) || microdata.extractFromHead();
			} else
				if (args[0] == 'itemview') {
					event.meta = explicitMeta(args) || microdata.extract(args[1]);
				} else
					if (args[0] == 'sectionentered') {
						event.meta = explicitMeta(args) || microdata.extract(args[1]);
					} else {
						event.meta = explicitMeta(args) || undefined;
					}
			return event;
	}
}