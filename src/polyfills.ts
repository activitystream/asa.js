import "promise-polyfill/src/polyfill";
import "whatwg-fetch";

if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    const subjectString = this.toString();
    if (
      typeof position !== "number" ||
      !isFinite(position) ||
      Math.floor(position) !== position ||
      position > subjectString.length
    ) {
      position = subjectString.length;
    }
    position -= searchString.length;
    const lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

// Safari, in Private Browsing Mode, looks like it supports localStorage and sessionStorage but all calls to setItem
// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
// to avoid the entire page breaking, without having to do a check at each usage of Storage.
if (window.localStorage) {
  try {
    localStorage.localStorage = 1;
    delete localStorage.localStorage;
  } catch (e) {
    const storageAPI = () => {
      const store = {};
      return {
        setItem(prop, value) {
          store[prop] = value;
        },
        getItem(prop) {
          return store[prop];
        },
        removeItem(prop) {
          delete store[prop];
        }
      };
    };

    const _localStorage = storageAPI();
    const _sessionStorage = storageAPI();

    const storage = Object.defineProperties(window, {
      localStorage: {
        get: () => _localStorage
      },
      sessionStorage: {
        get: () => _sessionStorage
      }
    });
    console.error(e);
    console.error(
      "Safari in private mode can not save settings, and some features may not work",
      "Warning!"
    );
  }
}
