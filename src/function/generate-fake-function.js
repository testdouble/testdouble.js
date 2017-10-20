import CallLog from '../value/call-log'
import Call from '../value/call'
import StubbingRegister from '../value/stubbing-register'

export default function generateFakeFunction (double) {
  const testDouble = function testDouble (...args) {
    const call = new Call(this, args)
    CallLog.instance.log(double, call)
    return StubbingRegister.instance.satisfy(double, call)
  }
  testDouble.toString = double.toString.bind(double)

  return testDouble
}
