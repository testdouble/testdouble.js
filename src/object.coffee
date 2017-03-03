_ = require('./util/lodash-wrap')
cloneWithNonEnumerableProperties = require('./util/clone-with-non-enumerable-properties')
getAllCustomPrototypalFunctionNames = require('./util/get-all-custom-prototypal-function-names')
isConstructor = require('./replace/is-constructor')
tdFunction = require('./function')

DEFAULT_OPTIONS = excludeMethods: ['then']

module.exports = (nameOrType, config) ->
  if isConstructor(nameOrType)
    createFakePrototype(nameOrType)
  else
    createFakeObject(nameOrType, config)

createFakePrototype = (type) ->
  class TestDoubleConstructor extends type
    constructor: td.function("#{nameOf(type)} constructor")

  _.tap TestDoubleConstructor, (fakeType) ->
    # Override "static" functions with instance test doubles
    _.each _.functions(type), (funcName) ->
      fakeType[funcName] = tdFunction("#{nameOf(type)}.#{funcName}")

    # Override prototypal functions with instance test doubles
    _.each getAllCustomPrototypalFunctionNames(type), (funcName) ->
      fakeType.prototype[funcName] = tdFunction("#{nameOf(type)}##{funcName}")

    addToStringToDouble(fakeType, "constructor", type)

createFakeObject = (nameOrType, config) ->
  fakeObject = if _.isPlainObject(nameOrType)
    createTestDoublesForPlainObject(nameOrType)
  else if _.isArray(nameOrType)
    createTestDoublesForFunctionNames(nameOrType)
  else
    createTestDoubleViaProxy(nameOrType, withDefaults(config))

  addToStringToDouble(fakeObject, "object", nameOrType)

createTestDoublesForPlainObject = (obj) ->
  _.reduce _.functions(obj), (memo, functionName) ->
    memo[functionName] = if isConstructor(obj[functionName])
      createFakePrototype(obj[functionName])
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

addToStringToDouble = (fakeObject, type, nameOrType) ->
  name = nameOf(nameOrType)
  fakeObject.toString = ->
    "[test double #{type}#{if name then " for \"#{name}\"" else ''}]"
  return fakeObject

nameOf = (nameOrType) ->
  if _.isFunction(nameOrType) && nameOrType.name?
    nameOrType.name
  else if _.isString(nameOrType)
    nameOrType
  else
    ''
