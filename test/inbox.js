/* global sinon */
var inbox = require('inbox');
var expect = require('chai').expect;
var core = require('server');
var info = require('version');
var features = require('features');

describe('inbox', function () {
    var requests = [];
	var xhr;
    var asa;
	var lastRequest = function (keepSession) {
		var request = JSON.parse(requests[0].requestBody);
        var element = request.ev;
        if (!keepSession) delete element.session;
        delete element.uid;
        delete element.t;
        delete element.location;
		delete request.t;
		return request;
	};

	var adjustSystemInfo = function (ev) {
        var element = ev.ev;
        element["v"] = info.version();
        if (element["location"]) 
            delete element["location"];
		return ev;
	};

	beforeEach(function () {
		features.clearExperiments();
		requests = [];
		xhr = sinon.useFakeXMLHttpRequest();
        xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
        asa = inbox(core.submitEvent);
	});

	afterEach(function () {
		xhr.restore();
	});

	describe('default pageview', function () {
		it('should sent only one event', function () {
			asa('pageview');

			expect(requests.length).to.equal(1);
		})
		it('should be a POST with data describing the event', function () {
			asa('pageview');
			var expectation = adjustSystemInfo({ "ev": { "type": "pageview", "page": "/test.html", "location": "sadfs", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "keywords": "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter" } } });

			expect(lastRequest()).to.eql(expectation);
		})
	})

	describe('pageview with custom meta', function () {
		it('should be a POST with data describing the event', function () {

			asa('pageview', { a: 's' });

			var expectation = adjustSystemInfo({ "ev": { "type": "pageview", "page": "/test.html", "location": "sadfs", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "keywords": "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter", "a": "s" } } });

			expect(lastRequest()).to.eql(expectation);
		})

	});
    
    xdescribe('commerce events catalog', function(){
        var entity = function(){};
        var item = function(){};
        var location = function(){};
        var rel = function(){};
        var role = function(){};
        var commerce = function(){};
    
       it('should send item carted event', function(){

           // variant 1
           asa('as.cart.item.added', { aspects : [
                commerce(
                    item()
                        .involves('CARTED', entity('EvenDate/123123123')
                            .relations(
                                rel().link(HOSTED_AT, entity('Venue/Operaen').aspects(location('12323,34553434'))),
                                rel().link(PART_OF, 'Event/Mads Langer'),
                                rel().link(MANUFACTURED_BY, 'Performer/Mads Langer')
                            )
                        )
                        .itemCount(2)
                        .itemPrice(123.5)
                        .currency('DKK')
                )
           ]});

           // variant 2
           asa('as.cart.item.added', {
               item : 'EventDate/23423423', 
               venue: 'Venue/Operaen', 
               producedBy: 'Producer/Operaen', 
               hostedAt : 'Venue/Operaen', 
               count : 2, 
               title: 'Mads Langer', 
               price : 123.5, 
               currency : 'DKK'
           });
       }) 
    });

	describe('custom events', function () {
		it('should send no metadata when none specified', function () {
			asa('custom_one');

			var expectation = adjustSystemInfo({ "ev": { "type": "custom", "event": "custom_one" } });

			expect(lastRequest()).to.eql(expectation);
		});
		it('should send metadata when client id specified as string', function () {
			asa('custom_one', 'offer1');

			var expectation = adjustSystemInfo({ "ev": { "type": "custom", "event": "custom_one", "meta": { "type": "http://schema.org/Offer", "properties": { "name": "Blend-O-Matic", "price": "$19.95", "reviews": { "type": "http://schema.org/AggregateRating", "properties": { "ratingValue": "4", "bestRating": "5", "ratingCount": "25" } } } } } });

			expect(lastRequest()).to.eql(expectation);
		});
		it('should send metadata when specified as DOM element', function () {
			asa('custom_one', document.getElementById('offer1'));

			var expectation = adjustSystemInfo({ "ev": { "type": "custom", "event": "custom_one", "meta": { "type": "http://schema.org/Offer", "properties": { "name": "Blend-O-Matic", "price": "$19.95", "reviews": { "type": "http://schema.org/AggregateRating", "properties": { "ratingValue": "4", "bestRating": "5", "ratingCount": "25" } } } } } });

			expect(lastRequest()).to.eql(expectation);
		});
		it('should send metadata when specified as explicit extra one', function () {
			asa('custom_one', { 'a': 's' });

			var expectation = adjustSystemInfo({ "ev": { "type": "custom", "event": "custom_one", "meta": { 'a': 's' } } });

			expect(lastRequest()).to.eql(expectation);
		});
		it('should send metadata when specified as DOM element and extra metadata', function () {
			asa('custom_one', document.getElementById('offer1'), { a: 's' });

			var expectation = adjustSystemInfo({ "ev": { "type": "custom", "event": "custom_one", "meta": { "a": "s", "type": "http://schema.org/Offer", "properties": { "name": "Blend-O-Matic", "price": "$19.95", "reviews": { "type": "http://schema.org/AggregateRating", "properties": { "ratingValue": "4", "bestRating": "5", "ratingCount": "25" } } } } } });

			expect(lastRequest()).to.eql(expectation);
		});
		it('should send metadata when specified as DOM element ID and extra metadata', function () {
			asa('custom_one', 'offer1', { a: 's' });

			var expectation = adjustSystemInfo({ "ev": { "type": "custom", "event": "custom_one", "meta": { "a": "s", "type": "http://schema.org/Offer", "properties": { "name": "Blend-O-Matic", "price": "$19.95", "reviews": { "type": "http://schema.org/AggregateRating", "properties": { "ratingValue": "4", "bestRating": "5", "ratingCount": "25" } } } } } });

			expect(lastRequest()).to.eql(expectation);
		});
	})

	describe('experiment miniAjax', function () {
		it('should be a POST with data describing the event', function () {
			features.defineExperiment(features.MINI_AJAX, 100);
			asa('pageview', { a: 's' });

			var expectation = adjustSystemInfo({ "ev": { "type": "pageview", "page": "/test.html", "location": "sadfs", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "keywords": "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter", "a": "s" } } });

			expect(lastRequest()).to.eql(expectation);
		})

	});

	xdescribe('batching - the implementation is shitty', function () {
		it('should have both events', function (done) {
			core.batchOn();
			var batchingInbox = inbox(core.batchEvent);
			batchingInbox('pageview', { a: 's' });
			batchingInbox('pageview', { a: 'd' });

			setTimeout(function () {
				core.batchOff();
				// var secondLastExpectation = adjustSystemInfo({ "ev": { "type": "pageview", "page": "/test.html", "location": "sadfs", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "keywords": "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter", "a": "s" } } });
				var lastExpectation = adjustSystemInfo({"ev" : { "type": "pageview", "page": "/test.html", "location": "sadfs", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "keywords": "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter", "a": "d" } }});

                var lr = lastRequest();
				expect(lastRequest()).to.eql(lastExpectation);
				// expect(secondLastRequest()).to.eql(secondLastExpectation);
				done();
			}, 700);
		})

	});
    
    describe('custom session management', function(){
        it('should allow devs to provide their own session id', function(){
            asa('session', function() {return 'my_session';});
            asa('pageview');
            expect(lastRequest(true).ev.session).to.equal('my_session');            
        })
    })

})