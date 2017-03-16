let _ = require('./util/lodash-wrap')
let quibble = require('quibble')
let store = require('./store')

let resetHandlers = []

module.exports = _.tap(() => {
  store.reset()
  quibble.reset()
  _.each(resetHandlers, (resetHandler) =>
    resetHandler())
  resetHandlers = []
}, (reset) => {
  reset.onNextReset = (func) =>
    resetHandlers.push(func)
})
