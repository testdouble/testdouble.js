_ = require('./util/lodash-wrap')
tdFunction = require('./function')
tdConstructor = require('./constructor')
cloneWithNonEnumerableProperties = require('./util/clone-with-non-enumerable-properties')
isConstructor = require('./replace/is-constructor')

DEFAULT_OPTIONS = excludeMethods: ['then']

module.exports = (nameOrType, config) ->
  fakeObject = if _.isPlainObject(nameOrType)
    createTestDoublesForPlainObject(nameOrType)
  else if _.isArray(nameOrType)
    createTestDoublesForFunctionNames(nameOrType)
  else
    createTestDoubleViaProxy(nameOrType, withDefaults(config))

  addToStringToDouble(fakeObject, nameOrType)

createTestDoublesForPlainObject = (obj) ->
  _.reduce _.functions(obj), (memo, functionName) ->
    memo[functionName] = if isConstructor(obj[functionName])
      tdConstructor(obj[functionName])
    else
      tdFunction(".#{functionName}")

    memo
  , cloneWithNonEnumerableProperties(obj)

createTestDoublesForFunctionNames = (names) ->
  _.reduce names, (memo, functionName) ->
    memo[functionName] = tdFunction(".#{functionName}")
    memo
  , {}

createTestDoubleViaProxy = (name, config) ->
  if typeof Proxy == 'undefined'
    throw new Error """
      The current runtime does not have Proxy support, which is what
      testdouble.js depends on when a string name is passed to `td.object()`.

      More details here:
        https://github.com/testdouble/testdouble.js/blob/master/docs/4-creating-test-doubles.md#objectobjectname

      Did you mean `td.object(['#{name}'])`?
    """

  proxy = new Proxy obj = {},
    get: (target, propKey, receiver) ->
      if !obj.hasOwnProperty(propKey) && !_.includes(config.excludeMethods, propKey)
        obj[propKey] = proxy[propKey] = tdFunction("#{nameOf(name)}##{propKey}")
      obj[propKey]

withDefaults = (config) ->
  _.extend({}, DEFAULT_OPTIONS, config)

addToStringToDouble = (fakeObject, nameOrType) ->
  name = nameOf(nameOrType)
  fakeObject.toString = ->
    "[test double object#{if name then " for \"#{name}\"" else ''}]"
  return fakeObject

nameOf = (nameOrType) ->
  if _.isString(nameOrType)
    nameOrType
  else
    ''
