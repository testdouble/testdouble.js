import CallLog from '../value/call-log'
import Call from '../value/call'
import satisfy from '../satisfy'

export default function generateFakeFunction (double) {
  const testDouble = function testDouble (...args) {
    const call = new Call(this, args)
    CallLog.instance.log(double, call)
    return satisfy(double, call)
  }
  testDouble.toString = double.toString.bind(double)

  return testDouble
}
