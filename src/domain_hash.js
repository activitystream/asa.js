// this hashing algorithm is as found in some version of Google Analytics
/* jshint ignore:start */

module.exports = require('./sha1'); 

function hash(d) {
    var a = 1, c = 0, h, o;
    if (d) {
        a = 0;
        for (h = d["length"] - 1; h >= 0; h--) {
            o = d.charCodeAt(h);
            a = (a << 6 & 268435455) + o + (o << 14);
            c = a & 266338304;
            a = c != 0 ? a ^ c >> 21 : a
        }
    }
    return a
};
/* jshint ignore:end */
