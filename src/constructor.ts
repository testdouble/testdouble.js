
import { Constructor0, Constructor1, Constructor2, Constructor3, Constructor4 } from './types'

import _ from './wrap/lodash'
import tdFunction from './function'
import imitate from './imitate'

export interface ConstructorType {
  <T>(typeOrNames: (keyof T)[]): Constructor0<T>
  <T>(typeOrNames: Constructor0<T>): Constructor0<T>
  <A1, T>(typeOrNames: Constructor1<A1, T>): Constructor1<A1, T>
  <A1, A2, T>(typeOrNames: Constructor2<A1, A2, T>): Constructor2<A1, A2, T>
  <A1, A2, A3, T>(typeOrNames: Constructor3<A1, A2, A3, T>): Constructor3<A1, A2, A3, T>
  <A1, A2, A3, A4, T>(typeOrNames: Constructor4<A1, A2, A3, A4, T>): Constructor4<A1, A2, A3, A4, T>
}

const constructor = ((typeOrNames: any) =>
_.isFunction(typeOrNames)
  ? imitate(typeOrNames)
  : fakeConstructorFromNames(typeOrNames)
) as ConstructorType

var fakeConstructorFromNames = <T>(funcNames: (keyof T)[]): Constructor0<T> => {
  return _.tap<Constructor0<T>>(tdFunction('(unnamed constructor)') as any, (fakeConstructor) => {
    fakeConstructor.prototype.toString = () =>
      '[test double instance of constructor]'

    _.each(funcNames, (funcName) => {
      fakeConstructor.prototype[funcName] = tdFunction(`#${String(funcName)}`)
    })
  })
}

export default constructor
