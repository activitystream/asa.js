var expect = require('chai').expect;
var info = require('../src/version');
var features = require('../src/features');

describe('script version', function(){
	it('should be same as major.minor.build-feature1.feature2 format', function(){
		features.defineExperiment('experiment1', 100);
		features.defineExperiment('experiment2', 100);
		expect(info.version()).to.equal([info.major, info.minor, info.build].join('.') + '-experiment1.experiment2');	
	});
	it('should be same as major.minor.build', function(){
		features.clearExperiments();
		expect(info.version()).to.equal([info.major, info.minor, info.build].join('.'));		
	});
});