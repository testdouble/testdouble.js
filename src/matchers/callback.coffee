_ = require('../util/lodash-wrap')

create = require('./create')

module.exports = create
  name: 'callback'
  matches: (matcherArgs, actual) ->
    _.isFunction(actual)
  onCreate: (matcherInstance, matcherArgs) ->
    matcherInstance.args = matcherArgs
    matcherInstance.__testdouble_callback = true

# Make callback itself quack like a matcher for its non-invoked use case.
module.exports.__name = 'callback'
module.exports.__matches = _.isFunction

module.exports.isCallback = (obj) ->
  obj == callback || obj?.__testdouble_callback == true
