import Double from '../../../src/value/double'
import Call from '../../../src/value/call'
import CallLog from '../../../src/value/call-log'

let satisfy, subject
module.exports = {
  beforeEach: () => {
    satisfy = td.replace('../../../src/satisfy').default

    subject = require('../../../src/function/generate-fake-function').default
  },
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
      const self = {}
      const call = new Call(self, [42])
      td.when(satisfy(double, call)).thenReturn('woot')

      const result = subject(double).call(self, 42)

      assert.equal(result, 'woot')
    }
  },
  'sets toString to that of the double': () => {
    const double = Double.create('name')

    const result = subject(double)

    assert.equal(result.toString(), double.toString())
  }
}
