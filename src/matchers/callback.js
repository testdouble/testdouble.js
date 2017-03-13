let _ = require('../util/lodash-wrap');

let create = require('./create');

let callback = create({
  name: 'callback',
  matches(matcherArgs, actual) {
    return _.isFunction(actual);
  },
  onCreate(matcherInstance, matcherArgs) {
    matcherInstance.args = matcherArgs;
    return matcherInstance.__testdouble_callback = true;
  }
});

// Make callback itself quack like a matcher for its non-invoked use case.
callback.__name = 'callback';
callback.__matches = _.isFunction;

callback.isCallback = obj => (obj === callback) || ((obj != null ? obj.__testdouble_callback : undefined) === true);

module.exports = callback;
