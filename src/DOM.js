
// Prototype of our jQuery killer ;)
function DOMElement() {
};

DOMElement.prototype.text = function text() {
    return this._element.textContent;
};

DOMElement.prototype.attr = function attr(name) {
    // emulating the jQuery behaviour
    var attr = this._element.getAttribute('' + name);
    if (attr == null) return undefined;
    else
        return attr;
};

DOMElement.prototype.prop = function prop(name) {
    return this._element[name];
};

DOMElement.prototype.children = function children() {

    var c = this._element.children,
        $doms = [],
        i, n = c.length;

    for (i = 0; i < n; i++)
        $doms[i] = $DOM(c[i]);

    return new DOMElements($doms);
};

function DOMElements(els) {
    this._els = els;
    this.length = els.length;
}

DOMElements.prototype.each = function each(callback) {
    for (var i = 0; i < this._els.length; i++) {
        var element = this._els[i];
        callback.call(element, i, element);
    }
};

DOMElements.prototype.get = function get(index) {
    return this._els[index];
};

// query parameter is either an element id or a css-style selector
var $DOM = module.exports = function $DOM(query) {

    if (!query || !(typeof query === 'string' || query instanceof Element || query instanceof DOMElement || query instanceof DOMElements)) {
        throw new Error('Invalid argument provided');
    }

    if (query instanceof DOMElement || query instanceof DOMElements) return query;

    if (query instanceof Element) {
        var wrapper = new DOMElement();
        wrapper._element = query;
        return wrapper;
    }

    query = ('' + query).trim();

    var elem, elems = [], i, n;

    try {
        if (query[0] === '#') {         
            elem = document.getElementById(query.substr(1));
            if (elem) elem = [elem]; else elem = [];
        } else {
            elem = document.querySelectorAll(query);
        }
        n = elem.length;

        for (i = 0; i < n; i++)
            elems.push($DOM(elem[i]));

        return new DOMElements(elems);
    } catch (exception) {
        throw new Error('Invalid selector: ' + query);
    }
};

