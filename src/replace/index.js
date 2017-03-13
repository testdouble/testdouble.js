let _ = require('../util/lodash-wrap');
let replaceModule = require('./module');
let replaceProperty = require('./property');

__guardMethod__(require('quibble'), 'ignoreCallsFromThisFile', o => o.ignoreCallsFromThisFile());

module.exports = function(target) {
  if (_.isString(target)) {
    return replaceModule(...arguments);
  } else {
    return replaceProperty(...arguments);
  }
};

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}