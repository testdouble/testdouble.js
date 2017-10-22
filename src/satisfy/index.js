import findLastStubbingMatch from './find-last-stubbing-match'
import invokeCallbacks from './invoke-callbacks'
import deliverOutcome from './deliver-outcome'

export default function satisfy (double, call) {
  const stubbing = findLastStubbingMatch(double, call)
  if (stubbing) {
    stubbing.addSatisfyingCall(call)
    invokeCallbacks(stubbing, call)
    return deliverOutcome(stubbing, call)
  }
}
