import popDemonstration from './pop-demonstration'
import didCallOccur from './did-call-occur'
import notifySatisfiedMatchers from './notify-satisfied-matchers'
import warnIfAlsoStubbed from './warn-if-also-stubbed'
import fail from './fail'

export default function verify (__userInvokesDemonstrationHere__, config) {
  const { double, call } = popDemonstration()
  if (didCallOccur(double, call, config)) {
    notifySatisfiedMatchers(double, call, config)
    warnIfAlsoStubbed(double, call, config)
  } else {
    fail(double, call, config)
  }
}
