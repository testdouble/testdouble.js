_ = require('lodash')

callsStore = require('./store/calls')
stubbingsStore = require('./store/stubbings')
stringifyArgs = require('./stringify-args')

module.exports = (testDouble) ->
  calls = callsStore.for(testDouble)
  stubs = stubbingsStore.for(testDouble)

  callCount: calls.length
  calls: calls
  description: """
  This test double has #{stubs.length} stubbings and #{calls.length} invocations.
  """ + stubbingDescription(stubs) + callDescription(calls)

stubbingDescription = (stubs) ->
  return "" if stubs.length == 0
  _.reduce stubs, (desc, stub) ->
    desc + "\n  - when called with `(#{stringifyArgs(stub.args)})`, then return `#{stub.stubbedValue}`."
  , "\n\nStubbings:"

callDescription = (calls) ->
  return "" if calls.length == 0
  _.reduce calls, (desc, call) ->
    desc + "\n  - called with `(#{stringifyArgs(call.args)})`."
  , "\n\nInvocations:"



