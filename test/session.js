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

    describe('store stuff in session', () => {
        it('should store data in session and give it back', () => {
            session.createSession({fle : 'flo'});
            expect(session.getSession().fle).to.equals('flo');
        })
    });
    
    describe('session id', () => {
        it('should generate one', () => {
            session.createSession();
            expect(session.getSession().id).to.be.a('string');
        });
    })
})