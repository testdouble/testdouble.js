import Double from '../../../src/value/double'
import Call from '../../../src/value/call'

import CallLog from '../../../src/value/call-log'

let subject
module.exports = {
  beforeEach: () => {
    subject = CallLog.instance
  },
  afterEach: () => {
    CallLog.reset()
  },
  'tracks calls (also resets)': () => {
    const double = new Double()
    const call = new Call()

    subject.log(double, call)

    assert.deepEqual(subject.for(double), [call])

    // (Can be reset)
    CallLog.reset()
    subject = CallLog.instance
    assert.equal(subject.for(double), undefined)
  },
  'can pop latest calls': () => {
    const double1 = new Double()
    const call1 = new Call()
    subject.log(double1, call1)
    const double2 = new Double()
    const call2 = new Call()
    subject.log(double2, call2)
    const call3 = new Call()
    subject.log(double1, call3)

    assert.deepEqual(subject.for(double1), [call1, call3])
    assert.deepEqual(subject.for(double2), [call2])

    const third = subject.pop()
    assert.deepEqual(third, {double: double1, call: call3})
    assert.deepEqual(subject.for(double1), [call1])

    const second = subject.pop()
    assert.deepEqual(second, {double: double2, call: call2})
    assert.deepEqual(subject.for(double2), [])

    const first = subject.pop()
    assert.deepEqual(first, {double: double1, call: call1})
    assert.deepEqual(subject.for(double1), [])
  }
}
