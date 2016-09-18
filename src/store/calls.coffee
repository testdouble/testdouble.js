_ =
  filter: require('lodash/filter')
  tap: require('lodash/tap')

store = require('./index')
argsMatch = require('./../args-match')

callHistory = [] #<-- remember this to pop our DSL of when(<call>)/verify(<call>)
store.onReset -> callHistory = []

module.exports =

  log: (testDouble, args, context) ->
    store.for(testDouble).calls.push({args, context})
    callHistory.push({testDouble, args, context})

  pop: ->
    _.tap (callHistory.pop()), (call) ->
      store.for(call.testDouble).calls.pop() if call?

  wasInvoked: (testDouble, args, config) ->
    matchingInvocationCount = this.where(testDouble, args, config).length
    if config.times?
      matchingInvocationCount == config.times
    else
      matchingInvocationCount > 0

  where: (testDouble, args, config) ->
    _.filter store.for(testDouble).calls, (call) ->
      argsMatch(args, call.args, config)

  for: (testDouble) ->
    store.for(testDouble).calls
