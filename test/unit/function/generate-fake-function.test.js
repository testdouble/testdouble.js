import Double from '../../../src/value/double'
import CallLog from '../../../src/value/call-log'
import StubbingRegister from '../../../src/value/stubbing-register'
import Stubbing from '../../../src/value/stubbing'
import subject from '../../../src/function/generate-fake-function'

module.exports = {
  'the fake function itself': {
    'logs calls': () => {
      const double = Double.create()

      subject(double).call('fake this', 1, 2, 3)

      var calls = CallLog.instance.for(double)
      assert.equal(calls.length, 1)
      assert.equal(calls[0].context, 'fake this')
      assert.deepEqual(calls[0].args, [1, 2, 3])
    },
    'registers stubbing': () => {
      const double = Double.create()
      const stubbing = new Stubbing('return', ['a', 'b'], ['c'])
      StubbingRegister.instance.add(double, stubbing)

      const result = subject(double)('a', 'b')

      assert.equal(result, 'c')
    }
  },
  'sets toString to that of the double': () => {
    const double = Double.create('name')

    const result = subject(double)

    assert.equal(result.toString(), double.toString())
  }
}
