import Double from '../../../src/value/double'
import Call from '../../../src/value/call'
import CallLog from '../../../src/value/call-log'
import StubbingRegister from '../../../src/value/stubbing-register'

let ensureRehearsal, chainStubbing, addImpliedCallbackArgIfNecessary, subject
module.exports = {
  beforeEach: () => {
    ensureRehearsal = td.replace('../../../src/when/ensure-rehearsal').default
    chainStubbing = td.replace('../../../src/when/chain-stubbing').default
    addImpliedCallbackArgIfNecessary = td.replace('../../../src/when/add-implied-callback-arg-if-necessary').default
    subject = require('../../../src/when/index').default
  },
  'adds a stubbing, returns the fake': () => {
    const double = new Double()
    const call = new Call(null, ['arg1', 'arg2'])
    CallLog.instance.log(double, call)
    td.when(chainStubbing(td.callback('a type', ['a stub']))).thenReturn('chained methods')
    td.when(addImpliedCallbackArgIfNecessary('a type', ['arg1', 'arg2'])).thenReturn('good args')

    const result = subject('_fake rehearsal arg_', 'some options')

    td.verify(ensureRehearsal({double, call}))
    assert.equal(result, 'chained methods')
    const stubbings = StubbingRegister.instance.get(double)
    assert.equal(stubbings.length, 1)
    assert.equal(stubbings[0].type, 'a type')
    assert.deepEqual(stubbings[0].args, 'good args')
    assert.deepEqual(stubbings[0].outcomes, ['a stub'])
    assert.equal(stubbings[0].options, 'some options')
  }
}
