import Double from '../../../src/value/double'
import Call from '../../../src/value/call'
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
    const double = new Double()
    const stubbing = new Stubbing()

    subject.add(double, stubbing)

    assert.deepEqual(subject.get(double), [stubbing])
  },
  'delegates to another thing to satisfy': () => {
    const double = new Double()
    const stubbing = new Stubbing()
    const call = new Call()
    const satisfy = td.replace('../../../src/satisfy').default
    td.when(satisfy(call, [stubbing])).thenReturn('pants')
    subject = require('../../../src/value/stubbing-register').default.instance
    subject.add(double, stubbing)

    const result = subject.satisfy(double, call)

    assert.equal(result, 'pants')
  }
}
