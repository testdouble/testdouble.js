_ = require('lodash')

store = require('./store')
callsStore = require('./store/calls')
stubbingsStore = require('./store/stubbings')
stringifyArgs = require('./stringify-args')

module.exports = (testDouble) ->
  calls = callsStore.for(testDouble)
  stubs = stubbingsStore.for(testDouble)

  callCount: calls.length
  calls: calls
  description: """
  This test double #{stringifyName(testDouble)}has #{stubs.length} stubbings and #{calls.length} invocations.
  """ + stubbingDescription(stubs) + callDescription(calls)

stubbingDescription = (stubs) ->
  return "" if stubs.length == 0
  _.reduce stubs, (desc, stub) ->
    desc + "\n  - when called with `(#{stringifyArgs(stub.args)})`, then return #{stringifyArgs(stub.stubbedValues, ", then ", "`")}."
  , "\n\nStubbings:"

callDescription = (calls) ->
  return "" if calls.length == 0
  _.reduce calls, (desc, call) ->
    desc + "\n  - called with `(#{stringifyArgs(call.args)})`."
  , "\n\nInvocations:"

stringifyName = (testDouble) ->
  if name = store.for(testDouble).name
    "`#{name}` "
  else
    ""
