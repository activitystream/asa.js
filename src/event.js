var microdata = require('./microdata');
var session = require('./session');
var info = require('./version');
var user = require('./user');
var _ = require('./utils');
var parseUri = require('./parseuri');
var Cookies = require('cookies-js');
var formatting = require('./formatting');
var getCampaign = require('./campaign');
var window = require('./browser').window;
var document = require('./browser').document;

var DOMMeta = function (o) {
    if (o.length < 2) return false;
    return (typeof o[1] === 'object' && typeof o[1].tagName === 'undefined') ? o[1] : false;
};

var pageview = function () {
    var title = document.title;
    var location = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.hash + window.location.search;
    return { type: 'pageview', location: location, title: title };
};

var sectionentered = function (section, page) {
    return { type: 'section_entered', section: section };
};

var custom = function (event) {
    var baseEvent = pageview();
    baseEvent.type = 'custom';
    baseEvent.event = event;
    return baseEvent;
};

var gatherMetaInfo = function gatherMetaInfo(a) {
    var event = a[0];
    var eventBody = {};
    if (event) {
        switch (event.trim()) {
            case 'pageview':
                eventBody = pageview.apply(null, [].slice.call(a, 1));
                break;
            case 'sectionentered':
                eventBody = sectionentered.apply(null, [].slice.call(a, 1));
                break;
            default:
                eventBody = custom.apply(null, a);
        }
        return eventBody;
    }
    throw new Error('Upsi! There is something wrong with this event:', a);
};


var gatherSystemInfo = function (e) {
    var sess = session.getSession();
    e.t = formatting.formatDateTime(new Date());
    e.session = sess.id;
    e.referrer = sess.referrer || '';
    var campaign = sess.campaign;
    if (campaign) e.campaign = campaign;
    e.uid = user.getUserId();
    var partnerId = window.sessionStorage.getItem('__as.partner_id');
    var partnerSId = window.sessionStorage.getItem('__as.partner_sid');
    if (partnerId) {
        e.partner_id = partnerId;
    }
    if (partnerSId) {
        e.partner_sid = partnerSId;
    }
    e.tenant_id = window.asaId;
    e.v = info.version();
    return e;
};

var postboxEvents = function(type, e, meta){
    var defaultEventInfo = {
        "type" : type,
        "occurred" : meta.t,  
        "origin" : window.location.host,
        "user" : {
            "did" : meta.uid,
            "sid" : meta.session
        },
        "page" : {
            "url" : window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.hash + window.location.search,
            "referrer" : meta.referrer
        }
    };
    return _.override(e, defaultEventInfo);
}
module.exports = {
    newpackage: function newpackages(eventname, domElement, extra) {
        var meta = gatherMetaInfo(arguments);
        meta = gatherSystemInfo(meta);
        return postboxEvents(arguments[0], arguments[1], meta);
    },
    package: function (eventname, domElement, extra) {

        var event = gatherMetaInfo(arguments);
        event = gatherSystemInfo(event);
        // if (arguments[0] == 'pageview') {
        //     return null;
        // } else
        if (arguments[0] == 'sessionStarted') {
            event.meta = microdata.extractFromHead();
            if (typeof arguments[1] === 'object') {
                event.meta = _.override(event.meta, arguments[1]);
            }
        } else
                if (arguments[0] == 'itemview') {
                    event.meta = DOMMeta(arguments) || microdata.extract(arguments[1]);
                } else
                    if (arguments[0] == 'sectionentered') {
                        event.meta = DOMMeta(arguments) || microdata.extract(arguments[1]);
                    } else {
                        var meta = undefined;
                        if (typeof domElement === 'string' || (typeof domElement === 'object' && typeof domElement.tagName !== 'undefined')) {
                            meta = microdata.extract(domElement);
                        } else
                            if (typeof extra === 'undefined' && typeof domElement === 'object') {
                                extra = domElement;
                                domElement = null;
                            }
                        meta = _.override(meta, extra);
                        if (meta !== undefined) event.meta = meta;
                    }
        return event;
    }
};