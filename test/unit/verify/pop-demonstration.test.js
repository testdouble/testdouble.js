import Double from '../../../src/value/double'
import Call from '../../../src/value/call'
import CallLog from '../../../src/value/call-log'

import subject from '../../../src/verify/pop-demonstration'

module.exports = {
  'there is a call' () {
    const double = Double.create()
    const call = new Call(null, [])
    CallLog.instance.log(double, call)

    const result = subject()

    assert.deepEqual(result, {double, call})
  },
  'there is no call in the log' () {
    const result = subject()

    assert.strictEqual(result, null)
  }
}
