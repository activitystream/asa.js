var m = require('microdata');
var expect = require('chai').expect;

describe('microdata', function () {
	it('should extract microdata from DOM element with a single metadata root', function () {
		var data = m.extract('offer1');
		expect(data).to.deep.equal({ "type": "http://schema.org/Offer", "properties": { "name": "Blend-O-Matic", "price": "$19.95", "reviews": { "type": "http://schema.org/AggregateRating", "properties": { "ratingValue": "4", "bestRating": "5", "ratingCount": "25" } } } });
	});

	it('should extract microdata from DOM element with multiple metadata roots', function () {
		var data = m.extract('multiple_meta_items');
		expect(data).to.deep.equal({ '__items' : [
			{ "type": "http://schema.org/Offer", "properties": { "name": "Blend-O-Matic1", "price": "$19.95", "reviews": { "type": "http://schema.org/AggregateRating", "properties": { "ratingValue": "4", "bestRating": "5", "ratingCount": "25" } } } },			
			{ "type": "http://schema.org/Offer", "properties": { "name": "Blend-O-Matic2", "price": "$19.95", "reviews": { "type": "http://schema.org/AggregateRating", "properties": { "ratingValue": "4", "bestRating": "5", "ratingCount": "25" } } } }			
		]});
	});

	it('should extract microdata from document HEAD', function () {
		var data = m.extractFromHead();
		expect(data).to.deep.equal({ "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website" });
	});
	
	describe('meta-data mapper', function(){
		it('should be able to replace each extracted piece of metadata', function(){
			
			m.setMapper(function(meta){
				return {c : 'd'};
			});
			var data = m.extractFromHead();
			expect(data).to.deep.equal({ "c" : "d" });	
		});
		it('should be able to convert metadata', function(){
			
			m.setMapper(function(meta){
				return {c : 'd', d : meta['og:description']};
			});
			var data = m.extractFromHead();
			expect(data).to.deep.equal({ "c" : "d", "d" : "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud." });	
		});
		it('should be "transparent" mappig using the noMapper', function(){
			expect(m.noMapper('dfd')).to.equal('dfd');
		});
		it('should provide metadata and DOM tree root element it was extracted from', function(done){
			m.setMapper(function(meta, el){
				expect(el.attr('id')).to.equal('offer1');
				expect(el.attr('data-event-id')).to.equal('123');
				done();
			});
			m.extract('offer1');
		});
		it('should provide only metadata and no DOM tree root element when extracting from HEAD', function(done){
			m.setMapper(function(meta, el){
				expect(el).to.be.undefined;
				done();
			});
			m.extractFromHead();
		});
	});
	
})