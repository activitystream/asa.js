var debugMode = false;
module.exports = {
	log : function(){
		if (debugMode){
			console.log.apply(console, arguments);
		}
	},
	setDebugMode : function(on){
		debugMode = on;
	}
}