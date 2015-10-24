calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = (__userDoesPretendInvocationHere__, config = {}) ->
  thenReturn: (stubbedValues...) ->
    if last = calls.pop()
      stubbings.add(last.testDouble, last.args, stubbedValues, config)
      last.testDouble
    else
      throw new Error """
        No test double invocation call detected for `when()`.

          Usage:
            when(myTestDouble('foo')).thenReturn('bar')
        """

