var _ = require('underscore');
var inbox = require('../src/inbox');
var expect = require('chai').expect;
var core = require('../src/server');
var info = require('../src/version');
var features = require('../src/features');
var browser = require('../src/browser');

describe('Campaigns', function () {
    var originalDocument, originalWindow;
    var events = [];

    function getNewTab() {
        return inbox(ev => events.push(ev)); 
    }

    function emptyEvents() {
        while(events.length > 0) events.pop();
    }

    beforeEach(function () {
        originalDocument = browser.document;
        originalWindow = browser.window;
        events = [];
        asa = getNewTab();
    })

    afterEach(function () {
        browser.document = originalDocument;
        browser.window = originalWindow;
    })

    it('should have campaign info', function () {
        browser.document = {
            location: 'http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource',
            referrer: 'http://smashbangpow.dk',
        };
        asa('pageview');
        asa('product.interest', {});
        var event = _.find(events, e => e.type === 'product.interest');
        expect(event).to.be.ok;
        expect(event.campaign.campaign).to.equals('testCampaign');
        expect(event.campaign.source).to.equals('testSource');
        expect(event.page.referrer).to.equals('http://smashbangpow.dk');
    })

    describe('Resume session', function () {
        it('opening two different tabs with two different campaigns', function () {
            browser.document = {
                location: 'http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource',
                referrer: 'http://smashbangpow.dk',
            };
            asa('pageview');
            asa('product.interest', {});
            browser.document = {
                location: 'http://flo.com/place?utm_campaign=testCampaign1&utm_source=testSource1',
                referrer: 'http://flipflop.dk',
            };            
            emptyEvents();
            tab2 = getNewTab();
            tab2('pageview');
            tab2('product.interest', {});
            var event = _.find(events, e => e.type === 'product.interest');

            expect(event).to.be.ok;
            expect(event.campaign.campaign).to.equals('testCampaign1');
            expect(event.campaign.source).to.equals('testSource1');
            expect(event.page.referrer).to.equals('http://flipflop.dk');
        })
    })
})
