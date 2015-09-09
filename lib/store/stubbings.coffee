_ = require('lodash')
store = require('./index')
callsStore = require('./calls')
argsMatch = require('./../args-match')

module.exports =
  add: (testDouble, args, stubbedValues) ->
    store.for(testDouble).stubbings.push({stubbedValues, args})

  get: (testDouble, args) ->
    return unless stubbing = stubbingFor(testDouble, args)
    callIndex = callsStore.where(testDouble, args).length - 1
    if callIndex < stubbing.stubbedValues.length
      stubbing.stubbedValues[callIndex]
    else
      _.last(stubbing.stubbedValues)

  for: (testDouble) ->
    store.for(testDouble).stubbings

stubbingFor = (testDouble, actualArgs) ->
  _(store.for(testDouble).stubbings).findLast (stubbing) ->
    argsMatch(stubbing.args, actualArgs)

