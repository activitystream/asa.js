var inbox = require('inbox');
var expect = require('chai').expect;
var core = require('server');
var info = require('version');
var features = require('features');

describe('inbox', function () {
    var requests = [];
	var xhr;
	var lastRequest = function () {
		var request = JSON.parse(requests[0].requestBody);
		for (var i = 0; i < request.ev.length; i++) {
			var element = request.ev[i];
			delete element.session;
			delete element.t;
		}
		delete request.t;
		return request;
	};
	
	var addSystemInfo = function(ev){
		for (var i = 0; i < ev.ev.length; i++) {
			var element = ev.ev[i];
			element["v"] = info.version();
			element["location"] = "http://localhost:8080/test.html"
		}	
		return ev;
	};

	beforeEach(function () {
		features.clearExperiments();
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
			var expectation = addSystemInfo({ "ev" : [{ "type": "pageview", "page": "/test.html", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website" } } ]});

			expect(lastRequest()).to.eql(expectation);
		})
	})
	
	describe('pageview with custom meta', function(){
		it('should be a POST with data describing the event', function () {

			inbox(function(e) {core.submitEvent(e);})('pageview', {a : 's'});

			var expectation = addSystemInfo({ "ev" : [{ "type": "pageview", "page": "/test.html", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "a": "s" } }]});

			expect(lastRequest()).to.eql(expectation);
		})
		
	});

	describe('experiment miniAjax', function(){
		it('should be a POST with data describing the event', function () {
			features.defineExperiment(features.MINI_AJAX, 100);
			inbox(function(e) {core.submitEvent(e);})('pageview', {a : 's'});

			var expectation = addSystemInfo({ "ev" : [{ "type": "pageview", "page": "/test.html", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "a": "s" } }]});

			expect(lastRequest()).to.eql(expectation);
		})
		
	});

	describe('batching', function(){
		it('should have both events', function (done) {
			core.batchOn();
			var batchingInbox = inbox(function(e) {core.batchEvent(e);});
			batchingInbox('pageview', {a : 's'});
			batchingInbox('pageview', {a : 'd'});

			setTimeout(function(){
				core.batchOff();
				var expectation = addSystemInfo({ "ev" : [{ "type": "pageview", "page": "/test.html", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "a": "s" } }, { "type": "pageview", "page": "/test.html", "title": "Opera, Ballett og Konserter | Operaen \\ Den Norske Opera & Ballett", "meta": { "og:description": "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.", "og:url": "http://operaen.no/", "og:title": "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett", "og:site_name": "Operaen.no", "og:type": "website", "a": "d" } }]});
	
				expect(lastRequest()).to.eql(expectation);
				done();
			}, 700);
		})
		
	});

})