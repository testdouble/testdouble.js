_ = require('lodash')
tdFunction = require('./function')

DEFAULT_OPTIONS = excludeMethods: ['then']

module.exports = (nameOrType, config) ->
  _.tap createTestDoubleObject(nameOrType, withDefaults(config)), (obj) ->
    obj.toString = -> description(nameOrType)

createTestDoubleObject = (nameOrType, config) ->
  if _.isFunction(nameOrType)
    createTestDoublesForPrototype(nameOrType)
  else if _.isPlainObject(nameOrType)
    createTestDoublesForFunctionBag(nameOrType)
  else if _.isArray(nameOrType)
    createTestDoublesForFunctionNames(nameOrType)
  else
    createTestDoubleViaProxy(nameOrType, config)

createTestDoublesForPrototype = (type) ->
  _.reduce Object.getOwnPropertyNames(type.prototype), (memo, name) ->
    memo[name] = if _.isFunction(type.prototype[name])
      tdFunction("#{nameOf(type)}##{name}")
    else
      type.prototype[name]
    memo
  , {}

createTestDoublesForFunctionBag = (bag) ->
  _(bag).functions().reduce (memo, functionName) ->
    memo[functionName] = tdFunction(".#{functionName}")
    memo
  , _.extend({}, bag)

createTestDoublesForFunctionNames = (names) ->
  _(names).reduce (memo, functionName) ->
    memo[functionName] = tdFunction(".#{functionName}")
    memo
  , {}

createTestDoubleViaProxy = (name, config) ->
  proxy = new Proxy obj = {},
    get: (target, propKey, receiver) ->
      if !obj.hasOwnProperty(propKey) && !_.include(config.excludeMethods, propKey)
        obj[propKey] = proxy[propKey] = tdFunction("#{nameOf(name)}##{propKey}")
      obj[propKey]

withDefaults = (config) ->
  _.extend({}, DEFAULT_OPTIONS, config)

nameOf = (nameOrType) ->
  if _.isFunction(nameOrType) && nameOrType.name?
    nameOrType.name
  else
    ''

description = (nameOrType) ->
  "[test double object#{if name = nameOf(nameOrType) then " for \"#{name}\"" else ''}]"
