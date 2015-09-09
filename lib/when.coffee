calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = ->
  thenReturn: (stubbedValues...) ->
    if last = calls.pop()
      stubbings.add(last.testDouble, last.args, stubbedValues)
      last.testDouble
    else
      throw new Error """
        No test double invocation call detected for `when()`.

          Usage:
            when(myTestDouble('foo')).thenReturn('bar')
        """

