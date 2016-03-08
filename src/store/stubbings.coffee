_ = require('lodash')
store = require('./index')
callsStore = require('./calls')
argsMatch = require('../args-match')
callback = require('../matchers/callback')

module.exports =
  add: (testDouble, args, stubbedValues, config) ->
    store.for(testDouble).stubbings.push({callCount: 0, stubbedValues, args, config})

  invoke: (testDouble, actualArgs) ->
    return unless stubbing = stubbingFor(testDouble, actualArgs)
    executePlan(stubbing, actualArgs)

  for: (testDouble) ->
    store.for(testDouble).stubbings

stubbingFor = (testDouble, actualArgs) ->
  _(store.for(testDouble).stubbings).findLast (stubbing) ->
    isSatisfied(stubbing, actualArgs)

executePlan = (stubbing, actualArgs) ->
  value = stubbedValueFor(stubbing)
  stubbing.callCount += 1
  invokeCallbackFor(stubbing, actualArgs)
  switch stubbing.config.plan
    when "thenReturn" then value
    when "thenDo" then value(actualArgs...)
    when "thenThrow" then throw value

invokeCallbackFor = (stubbing, actualArgs) ->
  return unless _.some(stubbing.args, callback.isCallback)
  _.each stubbing.args, (expectedArg, i) ->
    return unless callback.isCallback(expectedArg)
    callbackArgs = if expectedArg.args?
      expectedArg.args
    else if stubbing.config.plan == 'thenCallback'
      stubbing.stubbedValues
    else
      []

    actualArgs[i](callbackArgs...)


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

