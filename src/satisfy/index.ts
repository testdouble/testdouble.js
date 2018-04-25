import findLastStubbingMatch from './find-last-stubbing-match'
import invokeCallbacks from './invoke-callbacks'
import notifyAfterSatisfaction from '../matchers/notify-after-satisfaction'
import deliverOutcome from './deliver-outcome'

export default function satisfy (double, call) {
  const stubbing = findLastStubbingMatch(double, call)
  if (stubbing) {
    stubbing.addSatisfyingCall(call)
    invokeCallbacks(stubbing, call)
    notifyAfterSatisfaction(stubbing.args, call.args)
    return deliverOutcome(stubbing, call)
  }
}
