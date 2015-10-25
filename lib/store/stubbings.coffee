_ = require('lodash')
store = require('./index')
callsStore = require('./calls')
argsMatch = require('./../args-match')

module.exports =
  add: (testDouble, args, stubbedValues, config) ->
    store.for(testDouble).stubbings.push({callCount: 0, stubbedValues, args, config})

  invoke: (testDouble, args) ->
    return unless stubbing = stubbingFor(testDouble, args)
    stubbing.callCount += 1
    # TODO: callIndex uses the total call index. It ought to be local to the call
    # count of that particular stubbing (which we ought to store)
    callIndex = callsStore.where(testDouble, args).length - 1
    if callIndex < stubbing.stubbedValues.length
      stubbing.stubbedValues[callIndex]
    else
      _.last(stubbing.stubbedValues)

  for: (testDouble) ->
    store.for(testDouble).stubbings

stubbingFor = (testDouble, actualArgs) ->
  _(store.for(testDouble).stubbings).findLast (stubbing) ->
    isSatisfied(stubbing, actualArgs)

isSatisfied = (stubbing, actualArgs) ->
  argsMatch(stubbing.args, actualArgs, stubbing.config) &&
    hasTimesRemaining(stubbing)

hasTimesRemaining = (stubbing) ->
  return true unless stubbing.config.times?
  stubbing.callCount < stubbing.config.times

