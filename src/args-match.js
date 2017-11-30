import _ from './wrap/lodash'
import isMatcher from './matchers/is-matcher'

export default (expectedArgs, actualArgs, config = {}) => {
  if (arityMismatch(expectedArgs, actualArgs, config)) {
    return false
  } else if (config.allowMatchers !== false) {
    return equalsWithMatchers(expectedArgs, actualArgs)
  } else {
    return _.isEqual(expectedArgs, actualArgs)
  }
}

var arityMismatch = (expectedArgs, actualArgs, config) =>
  expectedArgs.length !== actualArgs.length && !config.ignoreExtraArgs

var equalsWithMatchers = (expectedArgs, actualArgs) =>
  _.every(expectedArgs, (expectedArg, key) =>
    argumentMatchesExpectation(expectedArg, actualArgs[key]))

var argumentMatchesExpectation = (expectedArg, actualArg) => {
  if (isMatcher(expectedArg)) {
    return matcherTestFor(expectedArg)(actualArg)
  } else {
    return _.isEqualWith(expectedArg, actualArg, (expectedEl, actualEl) => {
      if (isMatcher(expectedEl)) {
        return matcherTestFor(expectedEl)(actualEl)
      }
    })
  }
}

var matcherTestFor = (matcher) =>
  matcher.__matches
