_ = require('lodash')
store = require('./index')
callsStore = require('./calls')
argsMatch = require('./../args-match')

module.exports =
  add: (testDouble, args, stubbedValues, config) ->
    store.for(testDouble).stubbings.push({callCount: 0, stubbedValues, args, config})

  invoke: (testDouble, args) ->
    return unless stubbing = stubbingFor(testDouble, args)
    _.tap stubbedValueFor(stubbing), ->
      stubbing.callCount += 1

  for: (testDouble) ->
    store.for(testDouble).stubbings

stubbingFor = (testDouble, actualArgs) ->
  _(store.for(testDouble).stubbings).findLast (stubbing) ->
    isSatisfied(stubbing, actualArgs)

stubbedValueFor = (stubbing) ->
  if stubbing.callCount < stubbing.stubbedValues.length
    stubbing.stubbedValues[stubbing.callCount]
  else
    _.last(stubbing.stubbedValues)

isSatisfied = (stubbing, actualArgs) ->
  argsMatch(stubbing.args, actualArgs, stubbing.config) &&
    hasTimesRemaining(stubbing)

hasTimesRemaining = (stubbing) ->
  return true unless stubbing.config.times?
  stubbing.callCount < stubbing.config.times

