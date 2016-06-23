/* global sinon */
var inbox = require('../src/inbox');
var expect = require('chai').expect;
var core = require('../src/server');
var info = require('../src/version');
var features = require('../src/features');

describe('Postbox SDK', function () {
    var requests = [];
    var xhr;
    var asa;
    var lastRequest = function (options) {
        options = options || {};
        var request = JSON.parse(requests[0].requestBody);
        if (!options.keepSessionEvents && (request.ev.event && request.ev.event === 'sessionStarted'))
            request = JSON.parse(requests[1].requestBody);
        var element = request.ev;
        return request;
    };


    var adjustSystemInfo = function (ev) {
        var element = ev.ev;
        if (element.user.uid) element.user.uid = 'user_id'; 
        if (element.user.did) element.user.did = 'device_id'; 
        if (element.user.sid) element.user.sid = 'session_id'; 
        if (element.occurred) element.occurred = 'time'; 
        if (element.v) delete element.v; 
        if (element.tenant) delete element.tenant; 
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

    describe('product viewed', function () {
        it('sending data generates a complete message', function () {
            asa('product.viewed', {
                "product": {
                    "description": "SATURDAY NIGHT FEVER - THE MUSICAL",
                    "type": "Event",
                    "id": "1-4034344",
                    "product_variant": "Floor",
                    "price_category": "A",
                    "item_price": "222",
                    "currency": "DKK",
                    "categories": ["Teater", "Musical"]
                }
            });
            var expectation = {
                "type": "product.viewed",
                "occurred" : "time",  
                "origin" : window.location.host,
                "user" : {
                    "did": "device_id",
                    "sid": "session_id" 
                },
                "page" : {
                    "url" : window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.hash + window.location.search,
                    "referrer" : ""
                },
                "product": {
                    "description": "SATURDAY NIGHT FEVER - THE MUSICAL",
                    "type": "Event",
                    "id": "1-4034344",
                    "product_variant": "Floor",
                    "price_category": "A",
                    "item_price": "222",
                    "currency": "DKK",
                    "categories": ["Teater", "Musical"]
                }
             };
            var request = adjustSystemInfo(lastRequest({ keepSessionEvents: false, keepTitle: true }));
            expect(request.ev).to.eql(expectation);
        })
    })


})