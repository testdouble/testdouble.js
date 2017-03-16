let _ = require('./util/lodash-wrap')
let tdFunction = require('./function')
let tdConstructor = require('./constructor')
let copyProperties = require('./util/copy-properties')
let isConstructor = require('./replace/is-constructor')
let log = require('./log')

let DEFAULT_OPTIONS = {excludeMethods: ['then']}

module.exports = (nameOrType, config) =>
  _.tap(fakeObject(nameOrType, config), (obj) => {
    addToStringToDouble(obj, nameOrType)
  })

var fakeObject = (nameOrType, config) => {
  if (_.isPlainObject(nameOrType)) {
    return createTestDoublesForPlainObject(nameOrType)
  } else if (_.isArray(nameOrType)) {
    return createTestDoublesForFunctionNames(nameOrType)
  } else if (_.isFunction(nameOrType)) {
    return ensureFunctionIsNotPassed()
  } else {
    return createTestDoubleViaProxy(nameOrType, withDefaults(config))
  }
}

var createTestDoublesForPlainObject = (obj) =>
  _.transform(_.functions(obj), (acc, funcName) => {
    acc[funcName] = isConstructor(obj[funcName])
      ? tdConstructor(obj[funcName])
      : tdFunction(`.${funcName}`)
  }, copyProperties(obj, _.clone(obj)))

var createTestDoublesForFunctionNames = (names) =>
  _.transform(names, (acc, funcName) => {
    acc[funcName] = tdFunction(`.${funcName}`)
  })

var createTestDoubleViaProxy = (name, config) => {
  ensureProxySupport(name)
  let obj = {}
  return new Proxy(obj, {
    get (target, propKey, receiver) {
      if (!obj.hasOwnProperty(propKey) && !_.includes(config.excludeMethods, propKey)) {
        obj[propKey] = tdFunction(`${nameOf(name)}#${propKey}`)
      }
      return obj[propKey]
    }
  })
}

var ensureProxySupport = (name) => {
  if (typeof Proxy === 'undefined') {
    log.error('td.object', `\
The current runtime does not have Proxy support, which is what
testdouble.js depends on when a string name is passed to \`td.object()\`.

More details here:
  https://github.com/testdouble/testdouble.js/blob/master/docs/4-creating-test-doubles.md#objectobjectname

Did you mean \`td.object(['${name}'])\`?\
`)
  }
}

var withDefaults = (config) =>
  _.extend({}, DEFAULT_OPTIONS, config)

var addToStringToDouble = (fakeObject, nameOrType) => {
  let name = nameOf(nameOrType)
  fakeObject.toString = () => `[test double object${name ? ` for "${name}"` : ''}]`
}

var nameOf = (nameOrType) =>
  _.isString(nameOrType)
    ? nameOrType
    : ''

var ensureFunctionIsNotPassed = () =>
  log.error('td.object', `Functions are not valid arguments to \`td.object\` (as of testdouble@2.0.0). Please use \`td.function()\` or \`td.constructor()\` instead for creating fake functions.`)
