var inbox = require('inbox');
var expect = require('chai').expect;
var core = require('server');

describe('inbox', function () {
    var requests = [];
	var xhr;
	var lastRequest = function () {
		var request = JSON.parse(requests[0].requestBody);
		delete request.session;
		delete request.t;
		return request;
	};

	beforeEach(function () {
		requests = [];
		xhr = sinon.useFakeXMLHttpRequest();
        xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
	});

	afterEach(function () {
		xhr.restore();
	});

	describe('default pageview', function () {
		it('should sent only one event', function () {
			inbox(function(e) {core.submitEvent(e);})('pageview');

			expect(requests.length).to.equal(1);
		})
		it('should be a POST with data describing the event', function () {
			inbox(function(e) {core.submitEvent(e);})('pageview');
			var expectation = { "type": "pageview", "page": "/test.html", "location": "http://localhost/test.html", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "v": "1.0", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website" } };

			expect(lastRequest()).to.eql(expectation);
		})
	})
	
	describe('pageview with custom meta', function(){
		it('should be a POST with data describing the event', function () {

			inbox(function(e) {core.submitEvent(e);})('pageview', {a : 's'});

			var expectation = { "type": "pageview", "page": "/test.html", "location": "http://localhost/test.html", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "v": "1.0", "meta": { "a" : "s" } };

			expect(lastRequest()).to.eql(expectation);
		})
		
	});

})