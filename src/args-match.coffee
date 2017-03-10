_ = require('./util/lodash-wrap')


module.exports = (expectedArgs, actualArgs, config) ->
  return false if arityMismatch(expectedArgs, actualArgs, config)
  if config?.allowMatchers != false
    equalsWithMatchers(expectedArgs, actualArgs, config)
  else
    _.isEqual(expectedArgs, actualArgs)

arityMismatch =  (expectedArgs, actualArgs, config) ->
  expectedArgs.length != actualArgs.length && !config.ignoreExtraArgs

equalsWithMatchers = (expectedArgs, actualArgs, config) ->
  _.every expectedArgs, (expectedArg, key) ->
    argumentMatchesExpectation(expectedArg, actualArgs[key], config)

argumentMatchesExpectation = (expectedArg, actualArg, config) ->
  if matcher = matcherFor(expectedArg)
    matcher(actualArg)
  else if _.isArray(expectedArg) && _.isArray(actualArg)
    !arityMismatch(expectedArg, actualArg, config) && equalsWithMatchers(expectedArg, actualArg, config)
  else if _.isPlainObject(expectedArg) && _.isPlainObject(actualArg)
    (Object.keys(expectedArg).length == Object.keys(actualArg).length || config.ignoreExtraArgs) && equalsWithMatchers(expectedArg, actualArg, config)
  else
    _.isEqual(expectedArg, actualArg)

matcherFor = (expectedArg) ->
  if _.isFunction(expectedArg?.__matches)
    expectedArg.__matches
