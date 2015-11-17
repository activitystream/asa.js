var event = require('event');
var expect = require('chai').expect;
var moment = require('moment');

describe('formatDateTime', function () {
    xit('should give back the correct time', function(){
        var original = Date.prototype.getTimezoneOffset;
        Date.prototype.getTimezoneOffset = function(){return -120;}
        expect(moment(event.formatDateTime(new Date('1995-12-17T03:24:00.023+01:00'))).format()).to.eql(moment('1995-12-17T03:24:00.023+01:00').format());
        Date.prototype.getTimezoneOffset = original;        
    })
})
