var user = require('./user');
var experiments = {};
module.exports = {
	defineExperiment : function(name, percentage){
		experiments[name] = (user.getUserHash() % 100) <= percentage;
	},
	isExperiment : function(name){
		var exp = experiments[name];
		return !!exp;
	},
	clearExperiments : function(){
		experiments = {};	
	},
	experimentsLive : function(){
		var result = [];
		for (var exp in experiments) {
			if (experiments.hasOwnProperty(exp)) {
				if (experiments[exp]) result.push(exp);				
			}
		}
		return result.join('.');
	},
	MINI_AJAX : 'miniAjax'	
}