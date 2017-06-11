import _ from '../wrap/lodash'

import Double from '../value/double'
import CallLog from '../value/call-log'
import Call from '../value/call'
import StubbingRegister from '../value/stubbing-register'

export default (nameOrFunc) => {
  const name = deriveName(nameOrFunc)
  const real = _.isFunction(nameOrFunc) ? nameOrFunc : null
  const double = new Double(name, real, _.tap(function testDouble (...args) {
    const call = new Call(this, args)
    CallLog.instance.log(double, call)
    return StubbingRegister.instance.satisfy(double, call)
  }, (fakeFunction) => {
    fakeFunction.toString = () =>
      double.fullName == null ? '[test double (unnamed)]' : `[test double for "${double.fullName}"]`
  }))
  return double
}

const deriveName = (nameOrFunc) => {
  const name = _.isFunction(nameOrFunc) ? nameOrFunc.name : nameOrFunc
  return _.isEmpty(name) ? null : name
}
