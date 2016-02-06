_ = require('lodash')
store = require('./index')
callsStore = require('./calls')
argsMatch = require('./../args-match')

module.exports =
  add: (testDouble, args, stubbedValues, config) ->
    store.for(testDouble).stubbings.push({callCount: 0, stubbedValues, args, config})

  invoke: (testDouble, args) ->
    return unless stubbing = stubbingFor(testDouble, args)
    executePlan(stubbing, args)

  for: (testDouble) ->
    store.for(testDouble).stubbings

stubbingFor = (testDouble, actualArgs) ->
  _(store.for(testDouble).stubbings).findLast (stubbing) ->
    isSatisfied(stubbing, actualArgs)

executePlan = (stubbing, args) ->
  value = stubbedValueFor(stubbing)
  stubbing.callCount += 1
  switch stubbing.config.plan
    when "thenReturn" then value
    when "thenDo" then value(args...)
    when "thenThrow" then throw value

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

