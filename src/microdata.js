// var jq = $;
var jq = require('./DOM');
var debug = require('./debug');

var collectReferencedProperties = function (element, item) {
	var refString = element.attr('itemref');
	if (typeof refString !== 'undefined') {
		var refs = refString.split(' ');
		for (var i = 0; i < refs.length; i++) {
			var ref = refs[i];
			var refItem = jq('#' + ref);
			if (refItem.length === 1){
				collectProperties(refItem.get(0), item);
			}
			else {
				debug.log('missing metadata element', ref);
			}
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
		var child = jq(c);
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
	if (!el) return undefined; 
	var items = [];
	if (typeof el === 'string') { el = jq('#'+el).get(0); }
	else if (typeof el === 'object' && typeof el.tagName === 'string') { el = jq(el); }
	else return {};

	var processElement = function (e) {
		var el = jq(e);
		var itemScope = el.attr('itemscope');
		var itemProp = el.attr('itemprop');
		if (typeof itemScope !== 'undefined') {
			if (typeof itemProp !== 'undefined') {
				return;
			} else {
				items.push(theOneMapper(collectComplexProperty(el), el));
			}
		} else {
			el.children().each(function (_, c) {
				processElement(c);
			});
		}
	};

	processElement(el);

	if (items.length === 0) return {};
	if (items.length === 1) return items[0];
	return {'__items' : items};
};

var extractFromHead = function () {
	var meta = {};
	jq('head > meta[property^="og:"]').each(function () { var m = jq(this); meta[m.attr('property')] = m.attr('content'); });
	return theOneMapper(meta);
};
var noMapper = function(m) {return m;};
var theOneMapper = noMapper;
module.exports = {
	extract: findTopLevelItems,
	extractFromHead: extractFromHead,
	setMapper : function(mapper){
		theOneMapper = mapper;
	},
	noMapper : noMapper
};