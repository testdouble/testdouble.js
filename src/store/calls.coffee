_ = require('lodash')
store = require('./index')
argsMatch = require('./../args-match')

lastCall = null #<-- remember this to pop our DSL of when(<call>)/verify(<call>)
store.onReset -> lastCall = null

module.exports =

  log: (testDouble, args, context) ->
    store.for(testDouble).calls.push({args, context})
    lastCall = {testDouble, args, context}

  pop: ->
    _.tap (call = lastCall), (call) ->
      lastCall = null #<-- no double-dipping since it's global & destructive
      store.for(call.testDouble).calls.pop() if call?

  wasInvoked: (testDouble, args, config) ->
    matchingInvocationCount = this.where(testDouble, args, config).length
    if config.times?
      matchingInvocationCount == config.times
    else
      matchingInvocationCount > 0

  where: (testDouble, args, config) ->
    _.select store.for(testDouble).calls, (call) ->
      argsMatch(args, call.args, config)

  for: (testDouble) ->
    store.for(testDouble).calls

