import _ from './wrap/lodash'
import proxySafeCloneDeepWith from './wrap/proxy-safe-clone-deep-with'
import callsStore from './store/calls'
import store from './store'
import stringifyArgs from './stringify/arguments'
import stubbingsStore from './store/stubbings'

export default function explain (testDouble) {
  if (_.isFunction(testDouble)) {
    return explainFunction(testDouble)
  } else if (_.isObject(testDouble)) {
    return explainObject(testDouble)
  } else {
    return explainNonTestDouble(testDouble)
  }
}

function explainObject (obj) {
  const { explanations, children } = explainChildren(obj)

  return {
    name: null,
    callCount: 0,
    calls: [],
    description: describeObject(explanations),
    children,
    isTestDouble: explanations.length > 0
  }
}

function explainChildren (thing) {
  const explanations = []
  const children = proxySafeCloneDeepWith(thing, (val, key, obj, stack) => {
    if (_.isFunction(val) && stack) {
      return _.tap(explainFunction(val), (explanation) => {
        if (explanation.isTestDouble) explanations.push(explanation)
      })
    }
  })
  return { explanations, children }
}

function describeObject (explanations) {
  const count = explanations.length
  if (count === 0) return 'This object contains no test doubles'
  return `This object contains ${count} test double function${count > 1 ? 's' : ''}: [${_.map(explanations, e =>
    `"${e.name}"`
  ).join(', ')}]`
}

function explainFunction (testDouble) {
  if (store.for(testDouble, false) == null) { return explainNonTestDouble(testDouble) }
  const calls = callsStore.for(testDouble)
  const stubs = stubbingsStore.for(testDouble)
  const { children } = explainChildren(testDouble)

  return {
    name: store.for(testDouble).name,
    callCount: calls.length,
    calls,
    description:
      testdoubleDescription(testDouble, stubs, calls) +
      stubbingDescription(stubs) +
      callDescription(calls),
    children,
    isTestDouble: true
  }
}

function explainNonTestDouble (thing) {
  return ({
    name: undefined,
    callCount: 0,
    calls: [],
    description: `This is not a test double${_.isFunction(thing) ? ' function' : ''}.`,
    isTestDouble: false
  })
}

function testdoubleDescription (testDouble, stubs, calls) {
  return `This test double ${stringifyName(testDouble)}has ${stubs.length} stubbings and ${calls.length} invocations.`
}

function stubbingDescription (stubs) {
  return stubs.length > 0
    ? _.reduce(stubs, (desc, stub) =>
      desc + `\n  - when called with \`(${stringifyArgs(stub.args)})\`, then ${planFor(stub)} ${argsFor(stub)}.`
    , '\n\nStubbings:')
    : ''
}

function planFor (stub) {
  switch (stub.config.plan) {
    case 'thenCallback': return 'callback'
    case 'thenResolve': return 'resolve'
    case 'thenReject': return 'reject'
    default: return 'return'
  }
}

function argsFor (stub) {
  switch (stub.config.plan) {
    case 'thenCallback': return `\`(${stringifyArgs(stub.stubbedValues, ', ')})\``
    default: return stringifyArgs(stub.stubbedValues, ', then ', '`')
  }
}

function callDescription (calls) {
  return calls.length > 0
    ? _.reduce(calls, (desc, call) => desc + `\n  - called with \`(${stringifyArgs(call.args)})\`.`, '\n\nInvocations:')
    : ''
}

function stringifyName (testDouble) {
  const name = store.for(testDouble).name
  return name ? `\`${name}\` ` : ''
}
