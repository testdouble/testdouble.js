_ = require('lodash')
calls = require('./store/calls')
stubbings = require('./store/stubbings')
callback = require('./matchers/callback')
log = require('./log')

module.exports = (__userDoesPretendInvocationHere__, config = {}) ->
  thenReturn: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenReturn')
  thenCallback: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenCallback')
  thenDo: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenDo')
  thenThrow: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenThrow')

addStubbing = (stubbedValues, config, plan) ->
  _.assign(config, {plan})
  if last = calls.pop()
    stubbings.add(last.testDouble, concatImpliedCallback(last.args, config), stubbedValues, config)
    last.testDouble
  else
    log.error "td.when", """
      No test double invocation call detected for `when()`.

        Usage:
          when(myTestDouble('foo')).thenReturn('bar')
      """

concatImpliedCallback = (args, config) ->
  return args unless config.plan == 'thenCallback'

  if !_(args).some(callback.isCallback)
    args.concat(callback)
  else
    args
