import _ from './wrap/lodash'
import create from './matchers/create'

const callback = create({
  name: 'callback',
  matches (matcherArgs, actual) {
    return _.isFunction(actual)
  },
  onCreate (matcherInstance, matcherArgs) {
    matcherInstance.args = matcherArgs
    matcherInstance.__testdouble_callback = true
  }
})

// Make callback itself quack like a matcher for its non-invoked use case.
callback.__name = 'callback'
callback.__matches = _.isFunction

export default callback
