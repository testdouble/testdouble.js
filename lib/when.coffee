calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = ->
  thenReturn: (stubbedValue) ->
    if last = calls.pop()
      stubbings.add(last.testDouble, stubbedValue, last.args)
      last.testDouble
    else
      throw new Error """
        No test double invocation call detected for `when()`.

          Usage:
            when(myTestDouble('foo')).thenReturn('bar')
        """

