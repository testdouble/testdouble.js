_ = require('./util/lodash-wrap')

module.exports = (expectedArgs, actualArgs, config) ->
  return false if arityMismatch(expectedArgs, actualArgs, config)
  if config?.allowMatchers != false
    equalsWithMatchers(expectedArgs, actualArgs)
  else
    _.isEqual(expectedArgs, actualArgs)

arityMismatch =  (expectedArgs, actualArgs, config) ->
  expectedArgs.length != actualArgs.length && !config.ignoreExtraArgs

equalsWithMatchers = (expectedArgs, actualArgs) ->
  _.every expectedArgs, (expectedArg, key) ->
    argumentMatchesExpectation(expectedArg, actualArgs[key])

argumentMatchesExpectation = (expectedArg, actualArg) ->
  if matcher = matcherFor(expectedArg)
    matcher(actualArg)
  else
    _.isEqualWith expectedArg, actualArg, (expectedEl, actualEl) ->
      matcherFor(expectedEl)?(actualEl)

matcherFor = (expectedArg) ->
  if _.isFunction(expectedArg?.__matches)
    expectedArg.__matches
