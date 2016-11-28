var parseUri = require('./parseuri');
var browser = require('./browser');

var updatePartnerInfo = function (){
	var partnerIdKey = '__as.partner_id';
	var partnerSIdKey = '__as.partner_sid';
	var asaPartnerKey = '__asa';
	var uri = parseUri(browser.window.location.href);
	var asaPartnerValue = decodeURIComponent(uri.queryKey.__asa || '').split('|');
	var partnerId;
	var partnerSId;
	if (asaPartnerValue) {
		partnerId = asaPartnerValue[0];
		partnerSId = asaPartnerValue[1];
	}

	if (partnerId){
		browser.window.sessionStorage.setItem(partnerIdKey, partnerId);
	} else {
		browser.window.sessionStorage.removeItem(partnerIdKey);
	}
	if (partnerSId){
		browser.window.sessionStorage.setItem(partnerSIdKey, partnerSId);
	} else {
		browser.window.sessionStorage.removeItem(partnerSIdKey);
	}
};
module.exports = {

	setPartnerInfo : function(){
		var referrer = parseUri(browser.document.referrer).authority;
		var currentHost = parseUri(browser.window.location.origin).authority;
		console.log(referrer, currentHost);
		if (referrer != currentHost){
			updatePartnerInfo();
		}
	}

};
