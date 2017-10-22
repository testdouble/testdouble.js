import Call from '../../../src/value/call'
import Stubbing from '../../../src/value/stubbing'

module.exports = {
  '.hasTimesRemaining': {
    'no option set': () => {
      const subject = new Stubbing()

      assert.equal(subject.hasTimesRemaining, true)

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.hasTimesRemaining, true)
    },
    'times set to 0': () => {
      const subject = new Stubbing(null, null, null, {times: 0})

      assert.equal(subject.hasTimesRemaining, false)

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.hasTimesRemaining, false)
    },
    'times set to 1': () => {
      const subject = new Stubbing(null, null, null, {times: 1})

      assert.equal(subject.hasTimesRemaining, true)

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.hasTimesRemaining, false)
    },
    'times set to 2': () => {
      const subject = new Stubbing(null, null, null, {times: 2})

      assert.equal(subject.hasTimesRemaining, true)

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.hasTimesRemaining, true)

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.hasTimesRemaining, false)
    },
    'guards against duplicate calls (only count once)': () => {
      const subject = new Stubbing(null, null, null, {times: 2})

      assert.equal(subject.hasTimesRemaining, true)

      const call = new Call()
      subject.addSatisfyingCall(call)
      subject.addSatisfyingCall(call)
      subject.addSatisfyingCall(call)

      assert.equal(subject.hasTimesRemaining, true)

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.hasTimesRemaining, false)
    }
  },
  '.currentOutcome': {
    'one outcome set': () => {
      const subject = new Stubbing(null, null, ['pants'])

      assert.equal(subject.currentOutcome, 'pants')

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.currentOutcome, 'pants')

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.currentOutcome, 'pants')
    },
    'two outcomes set': () => {
      const subject = new Stubbing(null, null, ['pants', 'hat'])

      assert.equal(subject.currentOutcome, 'pants')

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.currentOutcome, 'pants')

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.currentOutcome, 'hat')

      subject.addSatisfyingCall(new Call())

      assert.equal(subject.currentOutcome, 'hat')
    }
  }
}
