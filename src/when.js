let _ = require('./util/lodash-wrap');

let calls = require('./store/calls');
let stubbings = require('./store/stubbings');
let callback = require('./matchers/callback');
let log = require('./log');
let tdConfig = require('./config');

module.exports = function(__userDoesPretendInvocationHere__, config) {
  if (config == null) { config = {}; }
  return {
    thenReturn(...stubbedValues) {
      return addStubbing(stubbedValues, config, 'thenReturn');
    },
    thenCallback(...stubbedValues) {
      return addStubbing(stubbedValues, config, 'thenCallback');
    },
    thenDo(...stubbedValues) {
      return addStubbing(stubbedValues, config, 'thenDo');
    },
    thenThrow(...stubbedValues) {
      return addStubbing(stubbedValues, config, 'thenThrow');
    },
    thenResolve(...stubbedValues) {
      warnIfPromiseless();
      return addStubbing(stubbedValues, config, 'thenResolve');
    },
    thenReject(...stubbedValues) {
      warnIfPromiseless();
      return addStubbing(stubbedValues, config, 'thenReject');
    }
  };
};

var addStubbing = function(stubbedValues, config, plan) {
  let last;
  _.assign(config, {plan});
  if ((last = calls.pop())) {
    stubbings.add(last.testDouble, concatImpliedCallback(last.args, config), stubbedValues, config);
    return last.testDouble;
  } else {
    return log.error("td.when", `\
No test double invocation call detected for \`when()\`.

  Usage:
    when(myTestDouble('foo')).thenReturn('bar')\
`
    );
  }
};

var concatImpliedCallback = function(args, config) {
  if (config.plan !== 'thenCallback') { return args; }

  if (!_.some(args, callback.isCallback)) {
    return args.concat(callback);
  } else {
    return args;
  }
};

var warnIfPromiseless = function() {
  if (tdConfig().promiseConstructor != null) { return; }
  return log.warn("td.when", `\
no promise constructor is set, so this \`thenResolve\` or \`thenReject\` stubbing
will fail if it's satisfied by an invocation on the test double. You can tell
testdouble.js which promise constructor to use with \`td.config\`, like so:

  td.config({
    promiseConstructor: require('bluebird')
  })\
`
  );
};
