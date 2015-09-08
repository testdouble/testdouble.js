calls = require('./store/calls')
stringifyArgs = require('./stringify-args')

module.exports = ->
  if last = calls.pop()
    if calls.wasInvoked(last.testDouble, last.args)
      # Do nothing! We're verified! :-D
    else
      throw new Error(unsatisfiedErrorMessage(last.testDouble, last.args))
  else
    throw new Error """
      No test double invocation call detected for `verify()`.

        Usage:
          verify(myTestDouble('foo'))
      """

unsatisfiedErrorMessage = (testDouble, args) ->
  """
  Unsatisfied test double verification.

    Wanted:
      - called with `(#{stringifyArgs(args)})`

    But there were no invocations of the test double.
  """
