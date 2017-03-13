let _ = require('./lodash-wrap');

module.exports = function(original, target) {
  let properties = Object.getOwnPropertyNames(original);

  Object.defineProperties(target, _.reduce(properties, function(memo, p) {
    if (!target.hasOwnProperty(p)) {
      memo[p] = {
        configurable: true,
        writable: true,
        value: original[p],
        enumerable: original.propertyIsEnumerable(p)
      };
    }
    return memo;
  }
  , {}));

  return target;
};

