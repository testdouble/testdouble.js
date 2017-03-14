let _ = require('./util/lodash-wrap')
let quibble = require('quibble')

let resetHandlers = []
module.exports = function () {
  require('./store').reset()
  if (typeof quibble.reset === 'function') {
    quibble.reset()
  }
  _.each(resetHandlers, f => f())
  return resetHandlers = []
}

module.exports.onNextReset = func => resetHandlers.push(func)
