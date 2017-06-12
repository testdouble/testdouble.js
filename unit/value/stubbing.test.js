import Stubbing from '../../src/value/stubbing'

module.exports = {
  'increments timesSatisfied (used for satisfaction-limits)': () => {
    const subject = new Stubbing()

    assert.equal(subject.timesSatisfied, 0)

    subject.incrementSatisfactions()
    assert.equal(subject.timesSatisfied, 1)

    subject.incrementSatisfactions()
    assert.equal(subject.timesSatisfied, 2)
  }
}
