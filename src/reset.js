const _ = require('./util/lodash-wrap')
const quibble = require('quibble')
const store = require('./store')

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
