import _ from './wrap/lodash'
import argsMatch from './args-match'
import callsStore from './store/calls'
import log from './log'
import store from './store'
import stringifyArgs from './stringify/arguments'
import stubbingsStore from './store/stubbings'
import notifyAfterSatisfaction from './matchers/notify-after-satisfaction'

export default (__userDoesRehearsalInvocationHere__, config = {}) => {
  const last = callsStore.pop()
  ensureRehearsalOccurred(last)
  if (callsStore.wasInvoked(last.testDouble, last.args, config)) {
    notifyMatchers(last.testDouble, last.args, config)
    warnIfStubbed(last.testDouble, last.args)
  } else {
    log.fail(unsatisfiedErrorMessage(last.testDouble, last.args, config))
  }
}

var ensureRehearsalOccurred = (last) => {
  if (!last) {
    log.error('td.verify', `\
No test double invocation detected for \`verify()\`.

  Usage:
    verify(myTestDouble('foo'))\
`)
  }
}

const notifyMatchers = (testDouble, expectedArgs, config) => {
  _.each(callsStore.where(testDouble, expectedArgs, config), (invocation) => {
    notifyAfterSatisfaction(expectedArgs, invocation.args)
  })
}

var warnIfStubbed = (testDouble, actualArgs) => {
  if (_.some(stubbingsStore.for(testDouble), (stubbing) =>
    argsMatch(stubbing.args, actualArgs, stubbing.config))
  ) {
    log.warn('td.verify',
      `test double${stringifyName(testDouble)} was both stubbed and verified with arguments (${stringifyArgs(actualArgs)}), which is redundant and probably unnecessary.`,
      'https://github.com/testdouble/testdouble.js/blob/master/docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double'
    )
  }
}

var unsatisfiedErrorMessage = (testDouble, args, config) =>
  baseSummary(testDouble, args, config) +
  matchedInvocationSummary(testDouble, args, config) +
  invocationSummary(testDouble, args, config)

var stringifyName = (testDouble) => {
  const name = store.for(testDouble).name
  return name ? ` \`${name}\`` : ''
}

var baseSummary = (testDouble, args, config) =>
  `\
Unsatisfied verification on test double${stringifyName(testDouble)}.

  Wanted:
    - called with \`(${stringifyArgs(args)})\`${timesMessage(config)}${ignoreMessage(config)}.\
`

var invocationSummary = (testDouble, args, config) => {
  const calls = callsStore.for(testDouble)
  if (calls.length === 0) {
    return '\n\n  But there were no invocations of the test double.'
  } else {
    return _.reduce(calls, (desc, call) =>
      desc + `\n    - called with \`(${stringifyArgs(call.args)})\`.`
    , '\n\n  All calls of the test double, in order were:')
  }
}

var matchedInvocationSummary = (testDouble, args, config) => {
  const calls = callsStore.where(testDouble, args, config)
  const expectedCalls = config.times || 0

  if (calls.length === 0 || calls.length > expectedCalls) {
    return ''
  } else {
    return _.reduce(_.groupBy(calls, 'args'), (desc, callsMatchingArgs, args) =>
      desc + `\n    - called ${pluralize(callsMatchingArgs.length, 'time')} with \`(${stringifyArgs(callsMatchingArgs[0].args)})\`.`
    , `\n\n  ${pluralize(calls.length, 'call')} that satisfied this verification:`)
  }
}

var pluralize = (x, msg) =>
  `${x} ${msg}${x === 1 ? '' : 's'}`

var timesMessage = (config) =>
  config.times != null
    ? ` ${pluralize(config.times, 'time')}`
    : ''

var ignoreMessage = (config) =>
  config.ignoreExtraArgs != null
    ? ', ignoring any additional arguments'
    : ''
