_ = require('./util/lodash-wrap')
cloneWithNonEnumerableProperties = require('./util/clone-with-non-enumerable-properties')
isConstructor = require('./replace/is-constructor')
tdFunction = require('./function')

DEFAULT_OPTIONS = excludeMethods: ['then']

module.exports = (nameOrType, config) ->
  _.tap createTestDoubleObject(nameOrType, withDefaults(config)), (obj) ->
    obj.toString = -> description(nameOrType)

createTestDoubleObject = (nameOrType, config) ->
  if isConstructor(nameOrType)
    createTestDoublesForPrototype(nameOrType)
  else if _.isPlainObject(nameOrType)
    createTestDoublesForPlainObject(nameOrType)
  else if _.isArray(nameOrType)
    createTestDoublesForFunctionNames(nameOrType)
  else
    createTestDoubleViaProxy(nameOrType, config)

getAllPropertyNames = (type) ->
  props = []
  while true
    props = _.union(props, Object.getOwnPropertyNames(type))
    break unless type = Object.getPrototypeOf(type)
  props

createTestDoublesForPrototype = (type) ->
  _.reduce getAllPropertyNames(type.prototype), (memo, name) ->
    memo[name] = if _.isFunction(type.prototype[name])
      tdFunction("#{nameOf(type)}##{name}")
    else
      type.prototype[name]
    memo
  , {}

createTestDoublesForPlainObject = (obj) ->
  _.reduce _.functions(obj), (memo, functionName) ->
    memo[functionName] = if isConstructor(obj[functionName])
      createTestDoublesForPrototype(obj[functionName])
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

nameOf = (nameOrType) ->
  if _.isFunction(nameOrType) && nameOrType.name?
    nameOrType.name
  else if _.isString(nameOrType)
    nameOrType
  else
    ''

description = (nameOrType) ->
  name = nameOf(nameOrType)
  "[test double object#{if name then " for \"#{name}\"" else ''}]"
