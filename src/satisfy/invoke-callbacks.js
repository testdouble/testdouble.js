import _ from '../wrap/lodash'

import isCallback from '../matchers/is-callback'
import callLater from '../share/call-later'

export default function invokeCallbacks (stubbing, call) {
  _.each(stubbing.args, (stubbingArg, i) => {
    if (isCallback(stubbingArg)) {
      const actualCallback = call.args[i]
      callLater(
        actualCallback,
        callbackArgs(stubbing, stubbingArg),
        stubbing.options.delay,
        stubbing.options.defer
      )
    }
  })
}

function callbackArgs (stubbing, callbackMatcher) {
  if (callbackMatcher.args != null) {
    return callbackMatcher.args
  } else if (stubbing.type === 'thenCallback') {
    return stubbing.outcomes
  } else {
    return []
  }
}
