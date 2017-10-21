import Double from '../../../src/value/double'
import Stubbing from '../../../src/value/stubbing'
import StubbingRegister from '../../../src/value/stubbing-register'

let subject
module.exports = {
  beforeEach: () => {
    subject = StubbingRegister.instance
  },
  afterEach: () => {
    StubbingRegister.reset()
  },
  'can add, retrieve a stubbing': () => {
    const double = Double.create()
    const stubbing = new Stubbing()

    subject.add(double, stubbing)

    assert.deepEqual(subject.get(double), [stubbing])
  }
}
