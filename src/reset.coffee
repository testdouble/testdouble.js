_ =
  each: require('lodash/each')
quibble = require('quibble')

resetHandlers = []
module.exports = ->
  require('./store').reset()
  quibble.reset?()
  _.each(resetHandlers, (f) -> f())
  resetHandlers = []

module.exports.onNextReset = (func) ->
  resetHandlers.push(func)
