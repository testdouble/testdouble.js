export default function verify (__userInvokesDemonstrationHere__, config) {
  // 1. double, call = CallLog.instance.pop
  // 2. ensureDemonstration(call)
  // 3. if call-occurred (double, call, config)
  //   a. notify-satisfied-matchers(double, call, config)
  //   b. warn-if-also-stubbed (double, call)
  // 4. else
  //   a. fail-verification (double, call, config)
}
