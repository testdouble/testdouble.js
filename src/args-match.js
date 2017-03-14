let _ = require('./util/lodash-wrap')

module.exports = function (expectedArgs, actualArgs, config) {
  if (arityMismatch(expectedArgs, actualArgs, config)) { return false }
  if ((config != null ? config.allowMatchers : undefined) !== false) {
    return equalsWithMatchers(expectedArgs, actualArgs)
  } else {
    return _.isEqual(expectedArgs, actualArgs)
  }
}

var arityMismatch = (expectedArgs, actualArgs, config) => (expectedArgs.length !== actualArgs.length) && !config.ignoreExtraArgs

var equalsWithMatchers = (expectedArgs, actualArgs) =>
  _.every(expectedArgs, (expectedArg, key) => argumentMatchesExpectation(expectedArg, actualArgs[key]))

var argumentMatchesExpectation = function (expectedArg, actualArg) {
  let matcher
  if ((matcher = matcherFor(expectedArg))) {
    return matcher(actualArg)
  } else {
    return _.isEqualWith(expectedArg, actualArg, (expectedEl, actualEl) => __guardFunc__(matcherFor(expectedEl), f => f(actualEl)))
  }
}

var matcherFor = function (expectedArg) {
  if (_.isFunction(expectedArg != null ? expectedArg.__matches : undefined)) {
    return expectedArg.__matches
  }
}

function __guardFunc__ (func, transform) {
  return typeof func === 'function' ? transform(func) : undefined
}
