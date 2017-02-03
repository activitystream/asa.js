var parseUri = require('./parseuri');
var browser = require('./browser');
module.exports = function getCampaign(location, referrer) {
    var campaignKeys;
    referrer = parseUri(referrer);
    location = parseUri(location);
    if (referrer.queryKey && referrer.queryKey['utm_campaign'])
        campaignKeys = campaignKeys || referrer.queryKey;

    if (location.queryKey && location.queryKey['utm_campaign'])
        campaignKeys = campaignKeys || location.queryKey;

    if (campaignKeys) {
        var campaign = {};
        if (campaignKeys.utm_campaign) campaign.campaign = campaignKeys.utm_campaign;
        if (campaignKeys.utm_source) campaign.source = campaignKeys.utm_source;
        if (campaignKeys.utm_medium) campaign.medium = campaignKeys.utm_medium;
        if (campaignKeys.utm_term) campaign.term = campaignKeys.utm_term;
        if (campaignKeys.utm_content) campaign.content = campaignKeys.utm_content;
        return campaign;
    }
    var utmKeys = ['utm_medium','utm_source','utm_campaign','utm_content','utm_term'];

    var __as__campagin = {};
    utmKeys.forEach(function (utm_key) {
        var utm_value = browser.window.sessionStorage.getItem('__as.' +  utm_key);
        if (utm_value) {
            __as__campagin[utm_key] = utm_value;
        }
    });
    if (Object.keys(__as__campagin).length) {
        var asCampaign = {};
        if (__as__campagin.utm_campaign) asCampaign.campaign = __as__campagin.utm_campaign;
        if (__as__campagin.utm_source) asCampaign.source = __as__campagin.utm_source;
        if (__as__campagin.utm_medium) asCampaign.medium = __as__campagin.utm_medium;
        if (__as__campagin.utm_term) asCampaign.term = __as__campagin.utm_term;
        if (__as__campagin.utm_content) asCampaign.content = __as__campagin.utm_content;
        return asCampaign;
    }
    return null;
};
