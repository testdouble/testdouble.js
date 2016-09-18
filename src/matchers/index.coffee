_ =
  every: require('lodash/every')
  includes: require('lodash/includes')
  isArray: require('lodash/isArray')
  isBoolean: require('lodash/isBoolean')
  isEqual: require('lodash/isEqual')
  isNumber: require('lodash/isNumber')
  isPlainObject: require('lodash/isPlainObject')
  isString: require('lodash/isString')
  some: require('lodash/some')

log = require('../log')
create = require('./create')
stringifyArguments = require('../stringify/arguments')

module.exports =
  create: create
  captor: require('./captor')

  isA: create
    name: (matcherArgs) ->
      s = if matcherArgs[0]?.name?
          matcherArgs[0].name
        else
          stringifyArguments(matcherArgs)
      "isA(#{s})"
    matches: (matcherArgs, actual) ->
      type = matcherArgs[0]

      if type == Number
        _.isNumber(actual)
      else if type == String
        _.isString(actual)
      else if type == Boolean
        _.isBoolean(actual)
      else
        actual instanceof type

  anything: create
    name: 'anything'
    matches: -> true

  contains: create
    name: 'contains'
    matches: (containings, actualArg) ->
      return false if containings.length == 0

      containsAllSpecified = (containing, actual) ->
        _.every containing, (val, key) ->
          return false unless actual?
          if _.isPlainObject(val)
            containsAllSpecified(val, actual[key])
          else
            _.isEqual(val, actual[key])

      _.every containings, (containing) ->
        if _.isArray(containing)
          _.some actualArg, (actualElement) ->
            _.isEqual(actualElement, containing)
        else if _.isPlainObject(containing) && _.isPlainObject(actualArg)
          containsAllSpecified(containing, actualArg)
        else
          _.includes(actualArg, containing)

  argThat: create
    name: 'argThat'
    matches: (matcherArgs, actual) ->
      predicate = matcherArgs[0]
      predicate(actual)

  not: create
    name: 'not'
    matches: (matcherArgs, actual) ->
      expected = matcherArgs[0]
      !_.isEqual(expected, actual)
