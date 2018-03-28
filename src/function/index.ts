
import { Function0, Function1, Function2, Function3, Function4 } from 'lodash'

import _ from '../wrap/lodash'

import create from './create'

export interface FuncType {
  (name: string): Function0<void>
  <R>(func: Function0<R>): Function0<R>
  <T1, R>(func: Function1<T1, R>): Function1<T1, R>
  <T1, T2, R>(func: Function2<T1, T2, R>): Function2<T1, T2, R>
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>): Function3<T1, T2, T3, R>
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>): Function4<T1, T2, T3, T4, R>
}

const func: FuncType = (nameOrFunc) => {
  if (_.isFunction(nameOrFunc)) {
    return create(_.isEmpty(nameOrFunc.name) ? null : nameOrFunc.name, nameOrFunc).fake
  } else {
    return create(nameOrFunc, null).fake
  }
}

export default func
