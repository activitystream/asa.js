	var parseUri = require('./parseuri');
    var window = require('./browser').window;
    var document = require('./browser').document;
	var updatePartnerInfo = function (){
		var partnerIdKey = '__as.partner_id';
		var partnerSIdKey = '__as.partner_sid';
		var uri = parseUri(window.location.href);
		var partnerId = uri.queryKey.__asa_partner_id;
		var partnerSId = uri.queryKey.__asa_partner_sid;
		if (partnerId){
			window.sessionStorage.setItem(partnerIdKey, uri.queryKey.__asa_partner_id);				
		} else {
			window.sessionStorage.removeItem(partnerIdKey);
		}
		if (partnerSId){
			window.sessionStorage.setItem(partnerSIdKey, uri.queryKey.__asa_partner_sid);				
		} else {
			window.sessionStorage.removeItem(partnerSIdKey);
		}
	};
module.exports = {
	
	setPartnerInfo : function(){
		var referrer = parseUri(document.referrer).authority;
		var currentHost = parseUri(window.location.origin).authority;
		if (referrer != currentHost){
			updatePartnerInfo();
		}
	}
	
};