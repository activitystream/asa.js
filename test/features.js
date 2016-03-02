var features = require('../src/features');
var expect = require('chai').expect;

describe('feature flippers', function(){
   it('should allow to define a feature with a boolean flag', function(){
        features.defineExperiment('always', true);
        expect(features.isExperiment('always')).to.be.true;               
        features.defineExperiment('never', false);
        expect(features.isExperiment('never')).to.be.false;               
   }) 
});