var expect = require('chai').expect;
var u = require('../src/utils');
describe('Utils', function () {
    describe('override', function(){
        it('should override with values of later objects', function () {
            expect(u.override({a: 'a'}, {a : 'b'})).to.be.eql({a : 'b'});
        })
        it('should not override with null value', function () {
            expect(u.override({a: 'a'}, {a : null})).to.be.eql({a : 'a'});
            expect(u.override({}, {a : null})).to.be.eql({});
        })
        it('should not override with undefined value', function () {
            expect(u.override({a: 'a'}, {a : undefined})).to.be.eql({a : 'a'});
        })
    })
})