/* global sinon */
var expect = require('chai').expect;
var session = require('../src/session');
describe('session', function () {
    before(function () {
        session.resetSessionMgmt();
    })
    
    describe('has session', function(){
        it('has session is true after session has been created', function(){
            session.createSession();
            expect(session.hasSession()).to.be.true; 
        })
        it('has session is false before session has been created', function(){
            expect(session.hasSession()).to.be.false; 
        })
    })

    describe('store stuff in session', function() {
        it('should store data in session and give it back',  function (){
            session.createSession({fle : 'flo'});
            expect(session.getSession().fle).to.equals('flo');
        })
        
        it('should update data in session', function(){
            session.createSession({fle : 'flo'});
            session.updateTimeout({fle : 'fle'})
            expect(session.getSession().fle).to.equals('fle');            
        })
    });
    
    describe('session id', function() {
        it('should generate one', function() {
            session.createSession();
            expect(session.getSession().id).to.be.a('string');
        });
    })
    
    describe('update session timeout', function() {
        it('should update expiry time', function(done) {
            session.createSession();
            var timeout1 = session.getSession().t;
            setTimeout(function(){
                try {
                    session.updateTimeout();
                    var timeout2 = session.getSession().t;
                    expect(timeout1).to.be.not.equals(timeout2);
                    done();                    
                } catch(e){
                    done(e);
                }                
            }, 10);
        })
    })
})