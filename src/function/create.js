import _ from '../wrap/lodash'

import Double from '../value/double'
import CallLog from '../value/call-log'
import Call from '../value/call'
import StubbingRegister from '../value/stubbing-register'

export default (nameOrFunc) => {
  const name = deriveName(nameOrFunc)
  const real = _.isFunction(nameOrFunc) ? nameOrFunc : null
  let double = new Double(name, real, _.tap(function testDouble (...args) {
    const call = new Call(this, args)
    CallLog.instance.log(double, call)
    return StubbingRegister.instance.satisfy(double, call)
  }, (fakeFunction) => {
    fakeFunction.toString = () =>
      name == null ? '[test double (unnamed)]' : `[test double for "${name}"]`
  }))
  return double
}

const deriveName = (nameOrFunc) => {
  const name = _.isFunction(nameOrFunc) ? nameOrFunc.name : nameOrFunc
  return _.isEmpty(name) ? null : name
}
