_ = require('lodash')

module.exports = (expectedArgs, actualArgs, config) ->
  return false if arityMismatch(expectedArgs, actualArgs, config)
  if config?.allowMatchers != false
    equalsWithMatchers(expectedArgs, actualArgs)
  else
    _.eq(expectedArgs, actualArgs)

arityMismatch =  (expectedArgs, actualArgs, config) ->
  expectedArgs.length != actualArgs.length && !config.ignoreExtraArgs

equalsWithMatchers = (expectedArgs, actualArgs) ->
  _.all expectedArgs, (expectedArg, i) ->
    argumentMatchesExpectation(expectedArg, actualArgs[i])

argumentMatchesExpectation = (expectedArg, actualArg) ->
  if matcher = matcherFor(expectedArg)
    matcher(actualArg)
  else
    _.eq(expectedArg, actualArg)

matcherFor = (expectedArg) ->
  if _.isFunction(expectedArg?.__matches)
    expectedArg.__matches
