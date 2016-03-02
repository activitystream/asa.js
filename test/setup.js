var cookies = require('../src/cookies');
beforeEach('cleanup user and session info', function () {
	var keys = cookies.keys();
	for (var i = 0; i < keys.length; i++) {
		var element = keys[i];
		cookies.removeItem(element);
	}
	keys = cookies.keys();
})