_ = require('lodash')

module.exports =
  isA: (type) ->
    __matches: (actual) ->
      if _.isNumber(actual)
        new Number(actual) instanceof type
      else if _.isString(actual)
        new String(actual) instanceof type
      else if _.isBoolean(actual)
        new Boolean(actual) instanceof type
      else
        actual instanceof type
