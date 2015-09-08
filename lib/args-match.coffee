_ = require('lodash')

module.exports = (expectedArgs, actualArgs) ->
  _.eq expectedArgs, actualArgs, (expected, actual) ->
    return true if _.eq(expectedArgs, actualArgs)
    _.all expectedArgs, (expectedArg, i) ->
      return true if _.eq(expectedArg, actualArgs[i])
      if _.isFunction(expectedArg?.__matches)
        expectedArg.__matches(actualArgs[i])
      else
        false

