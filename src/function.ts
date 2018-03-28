
import { Function0, Function1, Function2, Function3, Function4 } from 'lodash'

import _ from './wrap/lodash'
import calls from './store/calls'
import store from './store'
import stubbings from './store/stubbings'
import imitate from './imitate'

interface FuncType {
  (): Function0<void>
  (name: string): Function0<void>
  <R>(func: Function0<R>): Function0<R>
  <T1, R>(func: Function1<T1, R>): Function1<T1, R>
  <T1, T2, R>(func: Function2<T1, T2, R>): Function2<T1, T2, R>
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>): Function3<T1, T2, T3, R>
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>): Function4<T1, T2, T3, T4, R>
}

const func: FuncType = (nameOrFunc?, __optionalName?) => {
  return _.isFunction(nameOrFunc)
    ? imitate(nameOrFunc)
    : createTestDoubleNamed(nameOrFunc || __optionalName)
}

var createTestDoubleNamed = function (name) {
  return _.tap(createTestDoubleFunction(), (testDouble) => {
    const entry = store.for(testDouble, true)
    if (name != null) {
      entry.name = name
      testDouble.toString = () => `[test double for "${name}"]`
    } else {
      testDouble.toString = () => '[test double (unnamed)]'
    }
  })
}

var createTestDoubleFunction = function () {
  return function testDouble (...args) {
    calls.log(testDouble, args, this)
    return stubbings.invoke(testDouble, args, this)
  }
}

export default func
