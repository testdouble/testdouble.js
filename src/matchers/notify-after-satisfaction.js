import _ from '../wrap/lodash'
import isMatcher from './is-matcher'

// TODO: after rewrite, update signature to take (Stubbing/Verification, Call)
export default function notifyAfterSatisfaction (expectedArgs, actualArgs) {
  _.each(expectedArgs, (expectedArg, i) => {
    if (isMatcher(expectedArg)) {
      _.invoke(expectedArg, '__matches.afterSatisfaction', actualArgs[i])
    }
  })
}
