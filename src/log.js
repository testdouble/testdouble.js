let config = require('./config');

module.exports = {
  warn(func, msg, url) {
    if (config().ignoreWarnings) { return; }
    return __guardMethod__(console, 'warn', o => o.warn(`Warning: testdouble.js - ${func} - ${msg}${withUrl(url)}`));
  },

  error(func, msg, url) {
    if (config().suppressErrors) { return; }
    throw new Error(`Error: testdouble.js - ${func} - ${msg}${withUrl(url)}`);
  },

  fail(msg) {
    throw new Error(msg);
  }
};

var withUrl = function(url) {
  if (url == null) { return ""; }
  return ` (see: ${url} )`;
};

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}