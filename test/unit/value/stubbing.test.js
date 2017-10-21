import Stubbing from '../../../src/value/stubbing'

module.exports = {
  '.hasTimesRemaining': {
    'no option set': () => {
      const subject = new Stubbing()

      assert.equal(subject.hasTimesRemaining, true)

      subject.incrementSatisfactions()

      assert.equal(subject.hasTimesRemaining, true)
    },
    'times set to 0': () => {
      const subject = new Stubbing(null, null, null, {times: 0})

      assert.equal(subject.hasTimesRemaining, false)

      subject.incrementSatisfactions()

      assert.equal(subject.hasTimesRemaining, false)
    },
    'times set to 1': () => {
      const subject = new Stubbing(null, null, null, {times: 1})

      assert.equal(subject.hasTimesRemaining, true)

      subject.incrementSatisfactions()

      assert.equal(subject.hasTimesRemaining, false)
    },
    'times set to 2': () => {
      const subject = new Stubbing(null, null, null, {times: 2})

      assert.equal(subject.hasTimesRemaining, true)

      subject.incrementSatisfactions()

      assert.equal(subject.hasTimesRemaining, true)

      subject.incrementSatisfactions()

      assert.equal(subject.hasTimesRemaining, false)
    }

  }
}
