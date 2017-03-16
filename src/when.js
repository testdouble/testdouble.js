const _ = require('./util/lodash-wrap')
const calls = require('./store/calls')
const stubbings = require('./store/stubbings')
const callback = require('./matchers/callback')
const log = require('./log')
const tdConfig = require('./config')

module.exports = function (__userDoesPretendInvocationHere__, config = {}) {
  return {
    thenReturn (...stubbedValues) {
      return addStubbing(stubbedValues, config, 'thenReturn')
    },
    thenCallback (...stubbedValues) {
      return addStubbing(stubbedValues, config, 'thenCallback')
    },
    thenDo (...stubbedValues) {
      return addStubbing(stubbedValues, config, 'thenDo')
    },
    thenThrow (...stubbedValues) {
      return addStubbing(stubbedValues, config, 'thenThrow')
    },
    thenResolve (...stubbedValues) {
      warnIfPromiseless()
      return addStubbing(stubbedValues, config, 'thenResolve')
    },
    thenReject (...stubbedValues) {
      warnIfPromiseless()
      return addStubbing(stubbedValues, config, 'thenReject')
    }
  }
}

var addStubbing = (stubbedValues, config, plan) => {
  const last = calls.pop()
  ensureRehearsalOccurred(last)
  _.assign(config, {plan})
  stubbings.add(last.testDouble, concatImpliedCallback(last.args, config), stubbedValues, config)
  return last.testDouble
}

var ensureRehearsalOccurred = (last) => {
  if (!last) {
    return log.error('td.when', `\
No test double invocation call detected for \`when()\`.

  Usage:
    when(myTestDouble('foo')).thenReturn('bar')\
`
    )
  }
}

var concatImpliedCallback = (args, config) => {
  if (config.plan !== 'thenCallback') {
    return args
  } else if (!_.some(args, callback.isCallback)) {
    return args.concat(callback)
  } else {
    return args
  }
}

var warnIfPromiseless = () => {
  if (tdConfig().promiseConstructor == null) {
    log.warn('td.when', `\
no promise constructor is set, so this \`thenResolve\` or \`thenReject\` stubbing
will fail if it's satisfied by an invocation on the test double. You can tell
testdouble.js which promise constructor to use with \`td.config\`, like so:

  td.config({
    promiseConstructor: require('bluebird')
  })\
`)
  }
}
