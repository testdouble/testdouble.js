_ = require('./lodash-wrap')

module.exports = (type) ->
  _.uniq(_.without(allPrototypeFunctionNames(type), 'constructor'))

allPrototypeFunctionNames = (type) ->
  _.filter(allPrototypePropertyNames(type), (propName) ->
    _.isFunction(type.prototype[propName])
  )

allPrototypePropertyNames = (type) ->
  _.flatten(
    _.map(prototypeChain(type.prototype), Object.getOwnPropertyNames)
  )

prototypeChain = (proto) ->
  return [] if builtIn(proto)
  [proto].concat(prototypeChain(Object.getPrototypeOf(proto)))

builtIn = (proto) ->
  !proto? ||
    proto == Function.prototype ||
    proto == Object.prototype
