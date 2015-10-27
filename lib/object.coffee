_ = require('lodash')
tdFunction = require('./function')

DEFAULT_OPTIONS = excludeMethods: ['then']

module.exports = (nameOrType, config) ->
  _.tap createTestDoubleObject(nameOrType, withDefaults(config)), (obj) ->
    obj.toString = -> description(nameOrType)

createTestDoubleObject = (nameOrType, config) ->
  if hasPrototype(nameOrType)
    createTestDoublesForEntireType(nameOrType)
  else
    createTestDoubleViaProxy(nameOrType, config)

createTestDoubleViaProxy = (name, config) ->
  proxy = new Proxy obj = {},
    get: (target, propKey, receiver) ->
      if !obj.hasOwnProperty(propKey) && !_.include(config.excludeMethods, propKey)
        obj[propKey] = proxy[propKey] = tdFunction("#{nameOf(name)}##{propKey}")
      obj[propKey]

createTestDoublesForEntireType = (type) ->
  _.reduce Object.getOwnPropertyNames(type.prototype), (memo, name) ->
    memo[name] = if _.isFunction(type.prototype[name])
      tdFunction("#{nameOf(type)}##{name}")
    else
      type.prototype[name]
    memo
  , {}

withDefaults = (config) ->
  _.extend({}, DEFAULT_OPTIONS, config)

hasPrototype = (thing) -> thing?.prototype?

nameOf = (nameOrType) ->
  if hasPrototype(nameOrType)
    nameOrType.name
  else if nameOrType?
    nameOrType
  else
    ''

description = (nameOrType) ->
  "[test double object#{if name = nameOf(nameOrType) then " for \"#{name}\"" else ''}]"
