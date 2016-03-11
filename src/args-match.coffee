_ = require('lodash')

module.exports = (expectedArgs, actualArgs, config) ->
  return false if arityMismatch(expectedArgs, actualArgs, config)
  equalsWithMatchers(expectedArgs, actualArgs)

arityMismatch =  (expectedArgs, actualArgs, config) ->
  expectedArgs.length != actualArgs.length && !config.ignoreExtraArgs

equalsWithMatchers = (expectedArgs, actualArgs) ->
  _.eq expectedArgs, actualArgs, (expected, actual) ->
    _.all expectedArgs, (expectedArg, i) ->
      argumentMatchesExpectation(expectedArg, actualArgs[i])

argumentMatchesExpectation = (expectedArg, actualArg) ->
  if _.eq(expectedArg, actualArg)
    true
  else if matcher = matcherFor(expectedArg)
    matcher(actualArg)
  else
    false

# This is literally all that's needed to implement argument matchers & captors
matcherFor = (expectedArg) ->
  if _.isFunction(expectedArg?.__matches)
    expectedArg.__matches
