import findLastStubbingMatch from './find-last-stubbing-match'
import executePlan from './execute-plan'

export default function satisfy (double, call) {
  const stubbing = findLastStubbingMatch(double, call)
  if (stubbing) {
    return executePlan(double, call, stubbing)
  }
}
