import _ from './wrap/lodash'
import log from './log'
import tdFunction from './function'
import imitate from './imitate'
import proxy from './object/proxy'

const DEFAULT_OPTIONS = { excludeMethods: ['then'] }

export default function object (nameOrType, config) {
  return _.tap(fakeObject(nameOrType, config, arguments.length), (obj) => {
    addToStringToDouble(obj, nameOrType)
  })
}

var fakeObject = function (nameOrType, config, argCount) {
  if (_.isArray(nameOrType)) {
    return createTestDoublesForFunctionNames(nameOrType)
  } else if (_.isObjectLike(nameOrType)) {
    return imitate(nameOrType)
  } else if (_.isString(nameOrType) || argCount === 0) {
    return proxy(nameOrType, withDefaults(config))
  } else if (_.isFunction(nameOrType)) {
    ensureFunctionIsNotPassed()
  } else {
    ensureOtherGarbageIsNotPassed()
  }
}

var createTestDoublesForFunctionNames = (names) =>
  _.transform(names, (acc, funcName) => {
    acc[funcName] = tdFunction(`.${String(funcName)}`)
  })

var ensureFunctionIsNotPassed = () =>
  log.error('td.object', `Functions are not valid arguments to \`td.object\` (as of testdouble@2.0.0). Please use \`td.function()\` or \`td.constructor()\` instead for creating fake functions.`)

var ensureOtherGarbageIsNotPassed = () =>
  log.error('td.object', `\
To create a fake object with td.object(), pass it a plain object that contains
functions, an array of function names, or (if your runtime supports ES Proxy
objects) a string name.

If you passed td.object an instance of a custom type, consider passing the
type's constructor to \`td.constructor()\` instead.
`)

var withDefaults = (config) =>
  _.extend({}, DEFAULT_OPTIONS, config)

var addToStringToDouble = (fakeObject, nameOrType) => {
  const name = nameOf(nameOrType)
  fakeObject.toString = () => `[test double object${name ? ` for "${name}"` : ''}]`
}

var nameOf = (nameOrType) =>
  _.isString(nameOrType)
    ? nameOrType
    : ''
