var expect = require('chai').expect;
var server = require('../src/server');
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
    
    describe('runSafe', function(){
        beforeEach(function(){
            server.reset();
        })
        
        it('should retry function upon exception', function(done){
            server.override(function() {done('no sending of data');}, function(){done('no sending of error info');} );
            var runs = 0;
            u.runSafe(function(){
                runs++;
                throw 'no data';
            }, 'ignore', 10, 9, function(){
                expect(runs).to.equals(10);
                done();
            })
        })

        it('should not retry function when it finishes normally', function(done){
            server.override(function() {done('no sending of data');}, function(){done('no sending of error info');} );
            var runs = 0;
            u.runSafe(function(){
                runs++;
            }, 'ignore', 10, 9, function(){
                expect(runs).to.equals(1);
                done();
            })
        })

        it('should not fail when callback not provided', function(done){
            server.override(function() {done('no sending of data');}, function(){done('no sending of error info');} );
            var runs = 0;
            u.runSafe(function(){
                runs++;
            }, 'ignore', 10, 9);
            done();
        })
    })
})