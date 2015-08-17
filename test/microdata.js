var m = require('microdata');
var expect = require('chai').expect;

describe('microdata', function () {
	it('should extract microdata from DOM element', function () {
		var data = m.extract('offer1')[0];
		expect(data).to.deep.equal({ "type": "http://schema.org/Offer", "properties": { "name": "Blend-O-Matic", "price": "$19.95", "reviews": { "type": "http://schema.org/AggregateRating", "properties": { "ratingValue": "4", "bestRating": "5", "ratingCount": "25" } } } });
	});

	it('should extract microdata from document HEAD', function () {
		var data = m.extractFromHead();
		expect(data).to.deep.equal({ "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website" });
	});
})