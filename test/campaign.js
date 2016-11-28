var _ = require('underscore');
var inbox = require('../src/inbox');
// var partners = require('../src/partner');
var expect = require('chai').expect;
var core = require('../src/server');
var info = require('../src/version');
var features = require('../src/features');
var browser = require('../src/browser');

describe('Campaigns', function () {
    var originalDocument, originalWindow;
    var events = [];

    function getNewTab() {
        return inbox(function(ev){events.push(ev);});
    }

    function findEvent(ev) { return _.find(events, function(e) { return e.type === ev;});}

    function emptyEvents() {
        while(events.length > 0) events.pop();
    }

    beforeEach(function () {
        originalDocument = browser.document;
        originalWindow = browser.window;
        events = [];
        asa = getNewTab();
    });

    afterEach(function () {
        browser.document = originalDocument;
        browser.window = originalWindow;
    });

    it('should have campaign info', function () {
        browser.document = {
            location: 'http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource',
            referrer: 'http://smashbangpow.dk',
        };
        asa('pageview');
        asa('product.interest', {});
        var event = findEvent('product.interest');
        expect(event).to.be.ok;
        expect(event.campaign.campaign).to.equals('testCampaign');
        expect(event.campaign.source).to.equals('testSource');
        expect(event.page.referrer).to.equals('http://smashbangpow.dk');
    });

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
            var tab2 = getNewTab();
            tab2('pageview');
            tab2('product.interest', {});
            var event = findEvent('product.interest');

            expect(event).to.be.ok;
            expect(event.campaign.campaign).to.equals('testCampaign1');
            expect(event.campaign.source).to.equals('testSource1');
            expect(event.page.referrer).to.equals('http://flipflop.dk');
        })

        it('opening a tab from a campaign should not affect opening a tab with no campaign', function () {
            browser.document = {
                location: 'http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource',
                referrer: 'http://smashbangpow.dk',
            };
            asa('pageview');
            asa('product.interest', {});

            browser.document = {
                location: 'http://flo.com/place',
                referrer: '',
            };
            emptyEvents();
            var tab2 = getNewTab();
            tab2('pageview');
            tab2('product.interest', {});

            var event = findEvent('product.interest');
            expect(event).to.be.ok;
            expect(event.campaign).to.be.undefined;
            expect(event.page.referrer).to.equals('');
        });

        it('campaign info should persist through following steps on a site', function () {
            browser.document = {
                location: 'http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource',
                referrer: 'http://smashbangpow.dk',
            };
            asa('serviceProviders', 'http://paymentgw.gw');
            asa('pageview');
            asa('product.interest', {});

            browser.document = {
                location: 'http://fle.com/place2',
                referrer: 'http://fle.com/place',
            };
            emptyEvents();
            asa('pageview');
            asa('product.interest', {});

            var event = findEvent('product.interest');
            expect(event).to.be.ok;
            expect(event.campaign.campaign).to.equals('testCampaign');
            expect(event.campaign.source).to.equals('testSource');
            expect(event.page.referrer).to.equals('http://smashbangpow.dk');
        });

        it('campaign info should persist through jumps over service provider', function () {
            browser.document = {
                location: 'http://fle.com/place?utm_campaign=testCampaign&utm_source=testSource',
                referrer: 'http://smashbangpow.dk',
            };
            asa('serviceProviders', 'http://paymentgw.gw');
            asa('pageview');
            asa('product.interest', {});

            browser.document = {
                location: 'http://fle.com/place2',
                referrer: 'http://fle.com/place',
            };
            asa('serviceProviders', 'http://paymentgw.gw');
            asa('pageview');
            asa('product.interest', {});

            browser.document = {
                location: 'http://fle.com/place3',
                referrer: 'http://paymentgw.gw',
            };

            emptyEvents();
            asa('serviceProviders', 'http://paymentgw.gw');
            asa('pageview');
            asa('product.interest', {});

            var event = findEvent('product.interest');
            expect(event).to.be.ok;
            expect(event.campaign.campaign).to.equals('testCampaign');
            expect(event.campaign.source).to.equals('testSource');
            expect(event.page.referrer).to.equals('http://smashbangpow.dk');

        });

        // it('Crossdomain Partner and Session', function() {
        //     browser.document = {
        //         location: 'http://siteb.com/?buybekbea=aavekwwe&__asa=AS-E2EAUTOTEST%7C52770730.451c571a6556a2c69671b901430db663330b64ab&someotherparam=bla',
        //         referrer: 'http://sitea.com',
        //     };
        //     partners.setPartnerInfo();
        //     asa('serviceProviders', 'http://siteb.com/?buybekbea=aavekwwe&__asa=AS-E2EAUTOTEST%7C52770730.451c571a6556a2c69671b901430db663330b64ab&someotherparam=bla');
        //     asa('pageview');
        //     asa('product.interest', {});
        //
        //     var event = findEvent('product.interest');
        //     expect(event).to.be.ok;
        //     console.log(event);
        //     expect(event.page.referrer).to.equals('http://sitea.com');
        //     expect(event.partnerId).to.equals('AS-E2EAUTOTEST');
        //     expect(event.partnerSId).to.equals('52770730.451c571a6556a2c69671b901430db663330b64ab');
        // });

    })
})
