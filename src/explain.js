import _ from './util/lodash-wrap'
import callsStore from './store/calls'
import store from './store'
import stringifyArgs from './stringify/arguments'
import stubbingsStore from './store/stubbings'

export default (testDouble) => {
  if (store.for(testDouble, false) == null) { return nullDescription() }
  const calls = callsStore.for(testDouble)
  const stubs = stubbingsStore.for(testDouble)

  return {
    name: store.for(testDouble).name,
    callCount: calls.length,
    calls,
    description:
    testdoubleDescription(testDouble, stubs, calls) +
    stubbingDescription(stubs) +
    callDescription(calls),
    isTestDouble: true
  }
}

var nullDescription = () =>
({
  name: undefined,
  callCount: 0,
  calls: [],
  description: 'This is not a test double.',
  isTestDouble: false
})

var testdoubleDescription = (testDouble, stubs, calls) =>
`This test double ${stringifyName(testDouble)}has ${stubs.length} stubbings and ${calls.length} invocations.`

var stubbingDescription = (stubs) =>
  stubs.length > 0
    ? _.reduce(stubs, (desc, stub) =>
        desc + `\n  - when called with \`(${stringifyArgs(stub.args)})\`, then ${planFor(stub)} ${argsFor(stub)}.`
      , '\n\nStubbings:')
    : ''

var planFor = (stub) => {
  switch (stub.config.plan) {
    case 'thenCallback': return 'callback'
    case 'thenResolve': return 'resolve'
    case 'thenReject': return 'reject'
    default: return 'return'
  }
}

var argsFor = (stub) => {
  switch (stub.config.plan) {
    case 'thenCallback': return `\`(${stringifyArgs(stub.stubbedValues, ', ')})\``
    default: return stringifyArgs(stub.stubbedValues, ', then ', '`')
  }
}

var callDescription = (calls) =>
  calls.length > 0
    ? _.reduce(calls, (desc, call) => desc + `\n  - called with \`(${stringifyArgs(call.args)})\`.`, '\n\nInvocations:')
    : ''

var stringifyName = (testDouble) => {
  const name = store.for(testDouble).name
  return name ? `\`${name}\` ` : ''
}
