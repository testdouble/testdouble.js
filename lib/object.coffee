_ = require('lodash')
tdFunction = require('./function')

module.exports = (nameOrType, config) ->
  config = _.extend
    excludeMethods: ['then']
  , config
  _.tap createTestDoubleObject(nameOrType, config), (obj) ->
    obj.toString = ->

createTestDoubleObject = (nameOrType, config) ->
  if nameOrType?.prototype?
    createTestDoublesForEntireType(nameOrType)
  else
    createTestDoubleViaProxy(nameOrType, config)

createTestDoubleViaProxy = (name = '', config) ->
  proxy = new Proxy obj = {},
    get: (target, propKey, receiver) ->
      if !obj.hasOwnProperty(propKey) && !_.include(config.excludeMethods, propKey)
        obj[propKey] = proxy[propKey] = tdFunction("#{name}##{propKey}")
      obj[propKey]

createTestDoublesForEntireType = (type) ->
  _.reduce Object.getOwnPropertyNames(type.prototype), (memo, name) ->
    memo[name] = if _.isFunction(type.prototype[name])
      tdFunction("#{type.name}##{name}")
    else
      type.prototype[name]
    memo
  , {}
