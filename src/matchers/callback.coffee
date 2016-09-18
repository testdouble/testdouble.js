_ =
  isFunction: require('lodash/isFunction')

create = require('./create')

module.exports = callback = create
  name: 'callback'
  matches: (matcherArgs, actual) ->
    _.isFunction(actual)
  onCreate: (matcherInstance, matcherArgs) ->
    matcherInstance.args = matcherArgs
    matcherInstance.__testdouble_callback = true

# Make callback itself quack like a matcher for its non-invoked use case.
callback.__name = 'callback'
callback.__matches = _.isFunction

callback.isCallback = (obj) ->
  obj == callback || obj?.__testdouble_callback == true
