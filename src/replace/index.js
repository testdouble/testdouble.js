const quibble = require('quibble')
const _ = require('../util/lodash-wrap')
const replaceModule = require('./module')
const replaceProperty = require('./property')

quibble.ignoreCallsFromThisFile()

module.exports = function (target) {
  if (_.isString(target)) {
    return replaceModule(...arguments)
  } else {
    return replaceProperty(...arguments)
  }
}
