_ =
  extend: require('lodash/extend')
  functions: require('lodash/functions')
  includes: require('lodash/includes')
  isArray: require('lodash/isArray')
  isFunction: require('lodash/isFunction')
  isPlainObject: require('lodash/isPlainObject')
  isString: require('lodash/isString')
  reduce: require('lodash/reduce')
  tap: require('lodash/tap')
  union: require('lodash/union')

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

createTestDoublesForFunctionBag = (bag) ->
  _.reduce _.functions(bag), (memo, functionName) ->
    memo[functionName] = tdFunction(".#{functionName}")
    memo
  , _.extend({}, bag)

createTestDoublesForFunctionNames = (names) ->
  _.reduce names, (memo, functionName) ->
    memo[functionName] = tdFunction(".#{functionName}")
    memo
  , {}

createTestDoubleViaProxy = (name, config) ->
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
