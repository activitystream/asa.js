var parseUri = require('./parseuri');
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
    return null;
};

