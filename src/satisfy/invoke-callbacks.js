export default function invokeCallbacks (stubbing, call) {
}

var invokeCallbackFor = (stubbing, actualArgs) => {
  if (_.some(stubbing.args, isCallback)) {
    _.each(stubbing.args, (expectedArg, i) => {
      if (isCallback(expectedArg)) {
        callCallback(stubbing, actualArgs[i], callbackArgs(stubbing, expectedArg))
      }
    })
  }
}

var callbackArgs = (stubbing, expectedArg) => {
  if (expectedArg.args != null) {
    return expectedArg.args
  } else if (stubbing.config.plan === 'thenCallback') {
    return stubbing.stubbedValues
  } else {
    return []
  }
}

// stick this in a shared place?
// callLater(func, delay, defer)
var callCallback = (stubbing, callback, args) => {
  if (stubbing.config.delay) {
    return _.delay(callback, stubbing.config.delay, ...args)
  } else if (stubbing.config.defer) {
    return _.defer(callback, ...args)
  } else {
    return callback(...args) // eslint-disable-line
  }
}

