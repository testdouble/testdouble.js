_ = require('lodash')

module.exports = (expectedArgs, actualArgs) ->
  return true if _.eq(expectedArgs, actualArgs)
  return false if expectedArgs.length != actualArgs.length

  _.eq expectedArgs, actualArgs, (expected, actual) ->
    _.all expectedArgs, (expectedArg, i) ->
      return true if _.eq(expectedArg, actualArgs[i])
      if _.isFunction(expectedArg?.__matches)
        expectedArg.__matches(actualArgs[i])
      else
        false

