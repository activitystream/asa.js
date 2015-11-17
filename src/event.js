var microdata = require('./microdata');
var session = require('./session');
var info = require('./version');
var user = require('./user');
var _ = require('./utils');

var DOMMeta = function (o) {
    if (o.length < 2) return false;
    return (typeof o[1] === 'object' && typeof o[1].tagName === 'undefined') ? o[1] : false;
};

var pageview = function () {
    var title = document.title;
    var location = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.hash + window.location.search;
    var page = window.location.pathname + window.location.search;
    return { type: 'pageview', page: page, location: location, title: title };
};

var sectionentered = function (section, page) {
    page = page || window.location.pathname + window.location.hash + window.location.search;
    return { type: 'section_entered', page: page, section: section };
};

var custom = function (event) {
    return { type: 'custom', event: event };
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

var formatDateTime = function (time) {
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }
    function timezone(time) {
        var hours = pad(Math.abs(Math.floor(time / 60)));
        var minutes = pad(Math.abs(time % 60));
        var sign = time > 0 ? '-' : '+';
        return sign + hours + ':' + minutes;
    }

    return '' + time.getFullYear() +
        '-' + pad(time.getMonth() + 1) +
        '-' + pad(time.getDate()) +
        'T' + pad(time.getHours()) +
        ':' + pad(time.getMinutes()) +
        ':' + pad(time.getSeconds()) +
        '.' + (time.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        timezone(time.getTimezoneOffset());
}

var gatherSystemInfo = function (e) {
    e.t = formatDateTime(new Date());
    e.session = session.getSessionId();
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

module.exports = {
    formatDateTime: formatDateTime,
    package: function (eventname, domElement, extra) {

        var event = gatherMetaInfo(arguments);
        event = gatherSystemInfo(event);
        if (arguments[0] == 'pageview') {
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