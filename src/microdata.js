var debug = require('./debug');

var collectComplexProperty = function (element) {
	var item = {
		"type": element.attr("itemtype"),
		"properties": {}
	};
	collectProperties(element, item);
	return item;
}
var collectSimpleProperty = function (el) {
	var tag = el.prop('tagName');
	switch(tag){
		case 'TIME' : return el.attr('datetime');
		case 'A' : 
		case 'LINK' : 
			return el.attr('href');
		default:
			return el.prop("content") || el.text() || el.attr("src");
	}
	
}
var collectProperties = function (el, item) {
	el.children().each(function (_, c) {
		var child = $(c);
		var prop = child.attr('itemprop');
		if (prop) {
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

	var processElement = function (e) {
		var el = $(e);
		var scope = el.attr('itemscope');
		var prop = el.attr('itemprop');
		if (typeof scope !== 'undefined') {
			if (typeof prop !== 'undefined') {
				return;
			} else {
				var topLevelItem = {
					"type": el.attr("itemtype"),
					"properties": {}
				};
				collectProperties(el, topLevelItem);
				items.push(topLevelItem);
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

module.exports = {
	extract: findTopLevelItems
};