const _ = require('../util/lodash-wrap')
const create = require('./create')

module.exports = _.tap(create({
  name: 'callback',
  matches (matcherArgs, actual) {
    return _.isFunction(actual)
  },
  onCreate (matcherInstance, matcherArgs) {
    matcherInstance.args = matcherArgs
    matcherInstance.__testdouble_callback = true
  }
}), (callback) => {
  // Make callback itself quack like a matcher for its non-invoked use case.
  callback.__name = 'callback'
  callback.__matches = _.isFunction

  callback.isCallback = obj =>
    obj && (obj === callback || obj.__testdouble_callback === true)
})
