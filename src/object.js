let _ = require('./util/lodash-wrap')
let tdFunction = require('./function')
let tdConstructor = require('./constructor')
let copyProperties = require('./util/copy-properties')
let isConstructor = require('./replace/is-constructor')
let log = require('./log')

let DEFAULT_OPTIONS = {excludeMethods: ['then']}

module.exports = function (nameOrType, config) {
  let fakeObject = _.isPlainObject(nameOrType)
    ? createTestDoublesForPlainObject(nameOrType)
  : _.isArray(nameOrType)
    ? createTestDoublesForFunctionNames(nameOrType)
  : isConstructor(nameOrType)
    ? blowUpForConstructors()
  : createTestDoubleViaProxy(nameOrType, withDefaults(config))

  return addToStringToDouble(fakeObject, nameOrType)
}

var createTestDoublesForPlainObject = obj =>
  _.reduce(_.functions(obj), function (memo, functionName) {
    memo[functionName] = isConstructor(obj[functionName])
      ? tdConstructor(obj[functionName])
    : tdFunction(`.${functionName}`)

    return memo
  }
  , copyProperties(obj, _.clone(obj)))

var createTestDoublesForFunctionNames = names =>
  _.reduce(names, function (memo, functionName) {
    memo[functionName] = tdFunction(`.${functionName}`)
    return memo
  }
  , {})

var createTestDoubleViaProxy = function (name, config) {
  if (typeof Proxy === 'undefined') {
    throw new Error(`\
The current runtime does not have Proxy support, which is what
testdouble.js depends on when a string name is passed to \`td.object()\`.

More details here:
  https://github.com/testdouble/testdouble.js/blob/master/docs/4-creating-test-doubles.md#objectobjectname

Did you mean \`td.object(['${name}'])\`?\
`
    )
  }

  let obj = {}
  let proxy = new Proxy(obj, {
    get (target, propKey, receiver) {
      if (!obj.hasOwnProperty(propKey) && !_.includes(config.excludeMethods, propKey)) {
        obj[propKey] = (proxy[propKey] = tdFunction(`${nameOf(name)}#${propKey}`))
      }
      return obj[propKey]
    }
  })
  return proxy
}

var withDefaults = config => _.extend({}, DEFAULT_OPTIONS, config)

var addToStringToDouble = function (fakeObject, nameOrType) {
  let name = nameOf(nameOrType)
  fakeObject.toString = () => `[test double object${name ? ` for "${name}"` : ''}]`
  return fakeObject
}

var nameOf = function (nameOrType) {
  if (_.isString(nameOrType)) {
    return nameOrType
  } else {
    return ''
  }
}

var blowUpForConstructors = () =>
  log.error('td.object', `\
Constructor functions are not valid arguments to \`td.object\` (as of
testdouble@2.0.0). Please use the \`td.constructor()\` method instead for
creating fake constructors.\
`
  )
