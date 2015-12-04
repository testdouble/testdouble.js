_ = require('lodash')

module.exports = (expectedArgs, actualArgs, config) ->
  return true if _.eq(expectedArgs, actualArgs)
  return false if expectedArgs.length != actualArgs.length && !config.ignoreExtraArgs
  satisfiesEqualityPlusAnyArgumentMatchers(expectedArgs, actualArgs)

satisfiesEqualityPlusAnyArgumentMatchers = (expectedArgs, actualArgs) ->
  _.eq expectedArgs, actualArgs, (expected, actual) ->
    _.all expectedArgs, (expectedArg, i) ->
      argumentMatchesExpectation(expectedArg, actualArgs[i])

argumentMatchesExpectation = (expectedArg, actualArg) ->
  if _.eq(expectedArg, actualArg)
    true
  else if matcher = matcherHidingInExpectedArgument(expectedArg)
    matcher(actualArg)
  else
    false

# This is literally all that's needed to implement argument matchers & captors
matcherHidingInExpectedArgument = (expectedArg) ->
  if _.isFunction(expectedArg?.__matches)
    expectedArg.__matches
