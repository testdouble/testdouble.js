let quibble = require('quibble')
let _ = require('../util/lodash-wrap')
let replaceModule = require('./module')
let replaceProperty = require('./property')

if (quibble && typeof quibble.ignoreCallsFromThisFile === 'function') {
  quibble.ignoreCallsFromThisFile()
}

module.exports = function (target) {
  if (_.isString(target)) {
    return replaceModule(...arguments)
  } else {
    return replaceProperty(...arguments)
  }
}
