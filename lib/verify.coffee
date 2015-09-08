_ = require('lodash')
callsStore = require('./store/calls')
stringifyArgs = require('./stringify-args')

module.exports = ->
  if last = callsStore.pop()
    if callsStore.wasInvoked(last.testDouble, last.args)
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
      - called with `(#{stringifyArgs(args)})`.
  """ + invocationSummary(testDouble)

invocationSummary = (testDouble) ->
  calls = callsStore.for(testDouble)
  if calls.length == 0
    "\n\n  But there were no invocations of the test double."
  else
    _.reduce calls, (desc, call) ->
      desc + "\n    - called with `(#{stringifyArgs(call.args)})`."
    , "\n\n  But was actually called:"
