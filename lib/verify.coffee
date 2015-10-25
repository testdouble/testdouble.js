_ = require('lodash')
store = require('./store')
callsStore = require('./store/calls')
stringifyArgs = require('./stringify-args')

module.exports = (__userDoesPretendInvocationHere__, config = {}) ->
  if last = callsStore.pop()
    if callsStore.wasInvoked(last.testDouble, last.args, config)
      # Do nothing! We're verified! :-D
    else
      throw new Error(unsatisfiedErrorMessage(last.testDouble, last.args, config))
  else
    throw new Error """
      No test double invocation detected for `verify()`.

        Usage:
          verify(myTestDouble('foo'))
      """

unsatisfiedErrorMessage = (testDouble, args, config) ->
  """
  Unsatisfied verification on test double#{stringifyName(testDouble)}.

    Wanted:
      - called with `(#{stringifyArgs(args)})`#{timesMessage(config)}.
  """ + invocationSummary(testDouble)

invocationSummary = (testDouble) ->
  calls = callsStore.for(testDouble)
  if calls.length == 0
    "\n\n  But there were no invocations of the test double."
  else
    _.reduce calls, (desc, call) ->
      desc + "\n    - called with `(#{stringifyArgs(call.args)})`."
    , "\n\n  But was actually called:"

stringifyName = (testDouble) ->
  if name = store.for(testDouble).name
    " `#{name}`"
  else
    ""

timesMessage = (config) ->
  return "" unless config.times?
  " #{config.times} time#{if config.times == 1 then '' else 's'}"
