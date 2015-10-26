_ = require('lodash')
tdFunction = require('./function')

module.exports = (nameOrType) ->
  if nameOrType?.prototype?
    createTestDoublesForEntireType(nameOrType)
  else
    createTestDoubleViaProxy(nameOrType)

createTestDoubleViaProxy = (name) ->
  # TODO

createTestDoublesForEntireType = (type) ->
  _.reduce Object.getOwnPropertyNames(type.prototype), (memo, name) ->
    memo[name] = if _.isFunction(type.prototype[name])
      tdFunction("#{type.name}##{name}")
    else
      type.prototype[name]
    memo
  , {}

