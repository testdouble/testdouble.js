_ =
  find: require('lodash/find')
  reduce: require('lodash/reduce')

store = require('./store')
callsStore = require('./store/calls')
stubbingsStore = require('./store/stubbings')
stringifyArgs = require('./stringify/arguments')
log = require('./log')
argsMatch = require('./args-match')

module.exports = (__userDoesPretendInvocationHere__, config = {}) ->
  if last = callsStore.pop()
    if callsStore.wasInvoked(last.testDouble, last.args, config)
      # Do nothing! We're verified! :-D
      warnIfStubbed(last.testDouble, last.args)
    else
      log.fail(unsatisfiedErrorMessage(last.testDouble, last.args, config))
  else
    log.error "td.verify", """
      No test double invocation detected for `verify()`.

        Usage:
          verify(myTestDouble('foo'))
      """

warnIfStubbed = (testDouble, actualArgs) ->
  _.find stubbingsStore.for(testDouble), (stubbing) ->
    if argsMatch(stubbing.args, actualArgs, allowMatchers: false)
      log.warn 'td.verify', """
      test double#{stringifyName(testDouble)} was both stubbed and verified with arguments (#{stringifyArgs(actualArgs)}), which is redundant and probably unnecessary.
      """, "https://github.com/testdouble/testdouble.js/blob/master/docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double"
      true


unsatisfiedErrorMessage = (testDouble, args, config) ->
  """
  Unsatisfied verification on test double#{stringifyName(testDouble)}.

    Wanted:
      - called with `(#{stringifyArgs(args)})`#{timesMessage(config)}#{ignoreMessage(config)}.
  """ + invocationSummary(testDouble)

stringifyName = (testDouble) ->
  if name = store.for(testDouble).name
    " `#{name}`"
  else
    ""
invocationSummary = (testDouble) ->
  calls = callsStore.for(testDouble)
  if calls.length == 0
    "\n\n  But there were no invocations of the test double."
  else
    _.reduce calls, (desc, call) ->
      desc + "\n    - called with `(#{stringifyArgs(call.args)})`."
    , "\n\n  But was actually called:"

timesMessage = (config) ->
  return "" unless config.times?
  " #{config.times} time#{if config.times == 1 then '' else 's'}"

ignoreMessage = (config) ->
  return "" unless config.ignoreExtraArgs?
  ", ignoring any additional arguments"
