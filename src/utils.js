var copyProps = function copyProps(o1, o2){
	for (var key in o2) {
		if (o2.hasOwnProperty(key)) {
			o1[key] = o2[key];
		}
	}
}	
module.exports = {
	override: function (o1, o2) {
		if (!o1 && !o2) return undefined;
		if (!o1 && o2) return o2;
		if (o1 && !o2) return o1;
		var result = {};
		copyProps(result, o1);
		copyProps(result, o2);
		return result;
	}
}