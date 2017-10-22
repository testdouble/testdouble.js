import Call from '../../../src/value/call'
import Double from '../../../src/value/double'
import Stubbing from '../../../src/value/stubbing'
import StubbingRegister from '../../../src/value/stubbing-register'

import subject from '../../../src/satisfy/find-last-stubbing-match'

let stubbingRegister
module.exports = {
  beforeEach: () => {
    stubbingRegister = StubbingRegister.instance
  },
  'no stubbings': () => {
    const double = Double.create()
    const call = new Call(this, [])

    const result = subject(double, call)

    assert.equal(result, null)
  },
  '2 stub 1 match': () => {
    const double = Double.create()
    const call = new Call(this, [42])
    const stubbing1 = new Stubbing('thenBlah', [42], ['blah'])
    const stubbing2 = new Stubbing('thenBlah', [43], ['blah'])
    stubbingRegister.add(double, stubbing1)
    stubbingRegister.add(double, stubbing2)

    const result = subject(double, call)

    assert.equal(result, stubbing1)
  },
  '3 stub 2 matches': () => {
    const double = Double.create()
    const call = new Call(this, [42])
    const stubbing1 = new Stubbing('thenBlah', [42], ['blah'])
    const stubbing2 = new Stubbing('thenBlah', ['pants'], ['blah'])
    const stubbing3 = new Stubbing('thenBlah', [42], ['blah'])
    stubbingRegister.add(double, stubbing1)
    stubbingRegister.add(double, stubbing2)
    stubbingRegister.add(double, stubbing3)

    const result = subject(double, call)

    assert.equal(result, stubbing3)
  },
  'stubbing has limited satisfactions': () => {
    const double = Double.create()
    const call = new Call(this, [42])
    const stubbing1 = new Stubbing('thenBlah', [42], ['blah'])
    const stubbing2 = new Stubbing('thenBlah', ['pants'], ['blah'])
    const stubbing3 = new Stubbing('thenBlah', [42], ['blah'], {times: 2})
    stubbingRegister.add(double, stubbing1)
    stubbingRegister.add(double, stubbing2)
    stubbingRegister.add(double, stubbing3)
    stubbing3.addSatisfyingCall(new Call())
    stubbing3.addSatisfyingCall(new Call())

    const result = subject(double, call)

    assert.equal(result, stubbing1)
  }
}
