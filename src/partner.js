var parseUri = require('./parseuri');
var browser = require('./browser');

var updatePartnerInfo = function (){
	var partnerIdKey = '__as.partner_id';
	var partnerSIdKey = '__as.partner_sid';
	var uri = parseUri(browser.window.location.href);
	var partnerId = uri.queryKey.__asa_partner_id;
	var partnerSId = uri.queryKey.__asa_partner_sid;
	if (partnerId){
		browser.window.sessionStorage.setItem(partnerIdKey, uri.queryKey.__asa_partner_id);				
	} else {
		browser.window.sessionStorage.removeItem(partnerIdKey);
	}
	if (partnerSId){
		browser.window.sessionStorage.setItem(partnerSIdKey, uri.queryKey.__asa_partner_sid);				
	} else {
		browser.window.sessionStorage.removeItem(partnerSIdKey);
	}
};
module.exports = {
	
	setPartnerInfo : function(){
		var referrer = parseUri(browser.document.referrer).authority;
		var currentHost = parseUri(browser.window.location.origin).authority;
		if (referrer != currentHost){
			updatePartnerInfo();
		}
	}
	
};