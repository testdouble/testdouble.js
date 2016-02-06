_ = require('lodash')
calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = (__userDoesPretendInvocationHere__, config = {}) ->
  thenReturn: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenReturn')
  thenDo: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenDo')
  thenThrow: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenThrow')

addStubbing = (stubbedValues, config, plan) ->
  _.assign(config, {plan})
  if last = calls.pop()
    stubbings.add(last.testDouble, last.args, stubbedValues, config)
    last.testDouble
  else
    throw new Error """
      No test double invocation call detected for `when()`.

        Usage:
          when(myTestDouble('foo')).thenReturn('bar')
      """


