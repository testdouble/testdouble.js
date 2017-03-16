const _ = require('./util/lodash-wrap')
const store = require('./store')
const callsStore = require('./store/calls')
const stubbingsStore = require('./store/stubbings')
const stringifyArgs = require('./stringify/arguments')

module.exports = (testDouble) => {
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

var stubbingDescription = function (stubs) {
  if (stubs.length === 0) { return '' }
  return _.reduce(stubs, function (desc, stub) {
    return desc + `\n  - when called with \`(${stringifyArgs(stub.args)})\`, then ${planFor(stub)} ${argsFor(stub)}.`
  }
  , '\n\nStubbings:')
}

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

var callDescription = function (calls) {
  if (calls.length === 0) { return '' }
  return _.reduce(calls, (desc, call) => desc + `\n  - called with \`(${stringifyArgs(call.args)})\`.`
  , '\n\nInvocations:')
}

var stringifyName = function (testDouble) {
  const name = store.for(testDouble).name
  return name ? `\`${name}\` ` : ''
}
