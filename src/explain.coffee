_ =
  reduce: require('lodash/reduce')

store = require('./store')
callsStore = require('./store/calls')
stubbingsStore = require('./store/stubbings')
stringifyArgs = require('./stringify/arguments')

module.exports = (testDouble) ->
  return nullDescription() unless store.for(testDouble, false)?
  calls = callsStore.for(testDouble)
  stubs = stubbingsStore.for(testDouble)

  callCount: calls.length
  calls: calls
  description:
    testdoubleDescription(testDouble, stubs, calls) +
    stubbingDescription(stubs) +
    callDescription(calls)
  isTestDouble: true

nullDescription = ->
  callCount: 0
  calls: []
  description: "This is not a test double."
  isTestDouble: false

testdoubleDescription = (testDouble, stubs, calls) ->
  """
  This test double #{stringifyName(testDouble)}has #{stubs.length} stubbings and #{calls.length} invocations.
  """

stubbingDescription = (stubs) ->
  return "" if stubs.length == 0
  _.reduce stubs, (desc, stub) ->
    plan = switch stub.config.plan
      when 'thenCallback' then 'callback'
      when 'thenResolve' then 'resolve'
      when 'thenReject' then 'reject'
      else 'return'
    args = switch stub.config.plan
      when 'thenCallback' then "`(#{stringifyArgs(stub.stubbedValues, ", ")})`"
      else stringifyArgs(stub.stubbedValues, ", then ", "`")
    desc + "\n  - when called with `(#{stringifyArgs(stub.args)})`, then #{plan} #{args}."
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
