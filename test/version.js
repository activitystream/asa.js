var expect = require('chai').expect;
var info = require('version');
describe('script version', function(){
	it('should be same as major.minor.build', function(){
		expect(info.version()).to.equal([info.major, info.minor, info.build].join('.'));		
	});
})