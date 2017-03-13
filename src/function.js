let _ = require('./util/lodash-wrap');
let store = require('./store');
let calls = require('./store/calls');
let stubbings = require('./store/stubbings');
let copyProperties = require('./util/copy-properties');

module.exports = function(nameOrFunc, __optionalName) {
  if (_.isFunction(nameOrFunc)) {
    return createTestDoubleForFunction(nameOrFunc, __optionalName);
  } else {
    return createTestDoubleNamed(nameOrFunc || __optionalName);
  }
};

var createTestDoubleForFunction = (func, optionalName) =>
  _.tap(copyProperties(func, createTestDoubleNamed(func.name || optionalName)), testDouble =>
    _.each(_.functions(func), funcName => testDouble[funcName] = createTestDoubleNamed(`${func.name || optionalName || ''}.${funcName}`))
  )
;

var createTestDoubleNamed = name =>
  _.tap(createTestDoubleFunction(), function(testDouble) {
    let entry = store.for(testDouble, true);
    if (name != null) {
      entry.name = name;
      return testDouble.toString = () => `[test double for \"${name}\"]`;
    } else {
      return testDouble.toString = () => "[test double (unnamed)]";
    }
  })
;

var createTestDoubleFunction = function() {
  let testDouble;
  return testDouble = function(...args) {
    calls.log(testDouble, args, this);
    return stubbings.invoke(testDouble, args);
  };
};
