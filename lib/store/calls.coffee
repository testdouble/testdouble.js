_ = require('lodash')
store = require('./index')

lastCall = null #<-- remember this to pop our DSL of when(<call>)/verify(<call>)

module.exports =

  log: (testDouble, args, context) ->
    store.for(testDouble).calls.push({args, context})
    lastCall = {testDouble, args, context}

  pop: ->
    _.tap (call = lastCall), (call) ->
      lastCall = null #<-- no double-dipping since it's global & destructive
      store.for(call.testDouble).calls.pop() if call?

  for: (testDouble) ->
    store.for(testDouble).calls


