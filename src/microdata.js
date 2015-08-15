var collectReferencedProperties = function (element, item) {
	var refString = element.attr('itemref');
	if (typeof refString !== 'undefined') {
		var refs = refString.split(' ');
		for (var i = 0; i < refs.length; i++) {
			var ref = refs[i];
			collectProperties($('#' + ref), item);
		}
	}
};

var collectComplexProperty = function (element) {
	var item = {
		"type": element.attr("itemtype"),
		"properties": {}
	};
	collectReferencedProperties(element, item);
	collectProperties(element, item);
	return item;
};

var collectSimpleProperty = function (el) {
	var tag = el.prop('tagName');
	switch (tag) {
		case 'TIME': return el.attr('datetime');
		case 'A':
		case 'LINK':
			return el.attr('href');
		default:
			return el.prop("content") || el.text() || el.attr("src");
	}

};

var collectProperties = function (el, item) {
	el.children().each(function (_, c) {
		var child = $(c);
		var prop = child.attr('itemprop');
		if (typeof prop === 'string') {
			if (typeof child.attr('itemscope') !== 'undefined') {
				item.properties[prop] = collectComplexProperty(child);
			} else {
				item.properties[prop] = collectSimpleProperty(child);
			}
		}

		if (typeof child.attr('itemscope') == 'undefined') {
			collectProperties(child, item);
		}
	});
};

var findTopLevelItems = function (el) {
	var items = [];
	if (typeof el === 'string') { el = $('#' + el) } 
	else if (typeof el === 'object' && typeof el.tagName === 'string') { el = $(el); }
	else return {};

	var processElement = function (e) {
		var el = $(e);
		var scope = el.attr('itemscope');
		var prop = el.attr('itemprop');
		if (typeof scope !== 'undefined') {
			if (typeof prop !== 'undefined') {
				return;
			} else {
				items.push(collectComplexProperty(el));
			}
		} else {
			el.children().each(function (_, c) {
				processElement(c);
			});
		}
	};

	processElement(el);
	return items;
};

var extractFromHead = function () {
	var meta = {};
	$('head > meta[property^="og:"]').each(function () { var m = $(this); meta[m.attr('property')] = m.attr('content'); });
	return meta;
}

module.exports = {
	extract: findTopLevelItems,
	extractFromHead: extractFromHead
};