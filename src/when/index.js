import ensureRehearsal from './ensure-rehearsal'
import chainStubbing from './chain-stubbing'
import addImpliedCallbackArgIfNecessary from './add-implied-callback-arg-if-necessary'
import CallLog from '../value/call-log'
import StubbingRegister from '../value/stubbing-register'
import Stubbing from '../value/stubbing'

export default (__rehearseInvocationHere__, options) => {
  const rehearsal = CallLog.instance.pop()
  ensureRehearsal(rehearsal)
  return chainStubbing(rehearsal.double, (type, outcomes) => {
    StubbingRegister.instance.add(rehearsal.double, new Stubbing(
      type,
      addImpliedCallbackArgIfNecessary(type, rehearsal.call.args),
      outcomes,
      options
    ))
  })
}
