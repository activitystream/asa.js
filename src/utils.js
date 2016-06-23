var debug = require('./debug');
var server = require('./server');
var copyProps = function copyProps(o1, o2) {
    for (var key in o2) {
        if (o2.hasOwnProperty(key) && o2[key] !== null && o2[key] !== undefined) {
            o1[key] = o2[key];
        }
    }
}
module.exports = {
    override: function(o1, o2) {
        if (!o1 && !o2) return undefined;
        if (!o1 && o2) return o2;
        if (o1 && !o2) return o1;
        var result = {};
        copyProps(result, o1);
        copyProps(result, o2);
        return result;
    },
    runSafe: function runSafe(fn, msg, retryPeriod, retryCount, cb) {
        if (typeof retryCount === 'undefined') {
            retryCount = 10;
        }
        retryPeriod = retryPeriod || 100;
        cb = cb || function(){};
        try {
            fn();
            cb();
        } catch (e) {
            if (retryCount <= 0) {
                debug.forceLog('runSafe exception: ', e);
                server.submitError(e, { location: 'runSafe', arguments: arguments, description: msg });
                cb(e);
            } else {
                setTimeout(function(){runSafe(fn, msg, retryPeriod, retryCount - 1, cb)}, retryPeriod);
            }
        }
    }

}