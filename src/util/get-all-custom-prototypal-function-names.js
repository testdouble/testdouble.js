let _ = require('./lodash-wrap');

module.exports = type => _.uniq(_.without(allPrototypeFunctionNames(type), 'constructor'));

var allPrototypeFunctionNames = type =>
  _.filter(allPrototypePropertyNames(type), propName => _.isFunction(type.prototype[propName]))
;

var allPrototypePropertyNames = type =>
  _.flatten(
    _.map(prototypeChain(type.prototype), Object.getOwnPropertyNames)
  )
;

var prototypeChain = function(proto) {
  if (builtIn(proto)) { return []; }
  return [proto].concat(prototypeChain(Object.getPrototypeOf(proto)));
};

var builtIn = proto =>
  (proto == null) ||
    (proto === Function.prototype) ||
    (proto === Object.prototype)
;
