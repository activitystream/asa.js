var _ = require('underscore');
var inbox = require('../src/inbox');
var expect = require('chai').expect;
var core = require('../src/server');
var info = require('../src/version');
var features = require('../src/features');
var browser = require('../src/browser');

describe('New events', function(){
    var originalDocument, originalWindow;

    beforeEach(function(){
        originalDocument = browser.document;
        originalWindow = browser.window;
    })

    afterEach(function(){
        browser.document = originalDocument;
        browser.window = originalWindow;    
    })

    it('should have campaign info', function(){
        var events = []
        asa = inbox(ev => events.push(ev));
        browser.document = {
            location : 'http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource',
            referrer : 'http://smashbangpow.dk',
        };
        asa('pageview');
        asa('product.interest', {});
        var event = _.find(events, e => e.type === 'product.interest');
        expect(event).to.be.ok;
        expect(event.campaign.campaign).to.equals('testCampaign');
        expect(event.campaign.source).to.equals('testSource');
    })
})
