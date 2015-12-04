_ = require('lodash')
captor = require('./captor')

module.exports =
  captor: captor

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

  contains: (containings...) ->
    containsAllSpecified = (containing, actual) ->
      _.all containing, (val, key) ->
        return false unless actual?
        if _.isPlainObject(val)
          containsAllSpecified(val, actual[key])
        else
          _.eq(val, actual[key])

    __matches: (actual) ->
      _.all containings, (containing) ->
        if _.isString(containing)
          _.include(actual, containing)
        else if _.isArray(containing)
          _.any actual, (actualElement) ->
            _.eq(actualElement, containing)
        else if _.isPlainObject(containing)
          containsAllSpecified(containing, actual)
        else
          throw new Error("the contains() matcher only supports strings, arrays, and plain objects")

  argThat: (predicate) ->
    __matches: (actual) ->
      predicate(actual)

