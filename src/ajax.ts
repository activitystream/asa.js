module.exports = {
    post: /**
 * Make a X-Domain request to url and callback.
 *
 * @param url {String}
 * @param method {String} HTTP verb ('GET', 'POST', 'DELETE', etc.)
 * @param data {String} request body
 * @param callback {Function} to callback on completion
 * @param errback {Function} to callback on error
 */
    function xdr(url, method, callback) {
        var req;

        if (XMLHttpRequest) {
            req = new XMLHttpRequest();

            if ('withCredentials' in req) {
                req.open(method, url, true);
                req.onerror = function(e){callback(e, null);};
                req.onreadystatechange = function () {
                    if (req.readyState === 4) {
                        if (req.status >= 200 && req.status < 400) {
                            callback(null,req.responseText);
                        } else {
                            callback(new Error('Response returned with non-OK status'));
                        }
                    }
                };
                return req;
            }
        } else if (XDomainRequest) {
            req = new XDomainRequest();
            req.open(method, url);
            req.onerror = function(e){callback(e, null);};
            req.onload = function () {
                callback(null,req.responseText);
            };
            return req;
        } else {
            throw new Error('CORS not supported');
        }
    }
}