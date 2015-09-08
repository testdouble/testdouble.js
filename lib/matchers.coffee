_ = require('lodash')

module.exports =
  isA: (type) ->
    __matches: (actual) ->
      if type == Number
        _.isNumber(actual)
      else if type == String
        _.isString(actual)
      else if type == Boolean
        _.isBoolean(actual)
      else
        actual instanceof type
  anything: ->
    __matches: -> true
