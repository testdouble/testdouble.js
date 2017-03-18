import _ from './lodash-wrap'

export default (type) =>
  _.uniq(_.without(allPrototypeFunctionNames(type), 'constructor'))

var allPrototypeFunctionNames = (type) =>
  _.filter(allPrototypePropertyNames(type), (propName) =>
    _.isFunction(type.prototype[propName]))

var allPrototypePropertyNames = (type) =>
  _.flatten(_.map(prototypeChain(type.prototype), Object.getOwnPropertyNames))

var prototypeChain = (proto) =>
  isBuiltIn(proto)
    ? []
    : [proto].concat(prototypeChain(Object.getPrototypeOf(proto)))

var isBuiltIn = (proto) =>
  proto == null ||
    proto === Function.prototype ||
    proto === Object.prototype
