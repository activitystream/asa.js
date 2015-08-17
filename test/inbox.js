var inbox = require('inbox');
var expect = require('chai').expect;

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
		xhr = sinon.useFakeXMLHttpRequest();

        xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
	});

	afterEach(function () {
		xhr.restore();
	});

	it('should sent only one event', function () {
		var callback = sinon.spy();
		inbox('pageview');
		expect(requests.length).to.eql(1);
	})
	it('should be a POST with data describing the event', function () {
		inbox('pageview');
		var expectation = { "type": "pageview", "page": "/test.html", "location": "http://localhost/test.html", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website" } };

		expect(lastRequest()).to.eql(expectation);
	})
})