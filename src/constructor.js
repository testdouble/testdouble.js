import _ from './wrap/lodash'
import tdFunction from './function'
import imitate from './imitate'

export default (typeOrNames) =>
  _.isFunction(typeOrNames)
    ? imitate(typeOrNames)
    : fakeConstructorFromNames(typeOrNames)

var fakeConstructorFromNames = (funcNames) => {
  return _.tap(tdFunction('(unnamed constructor)'), (fakeConstructor) => {
    fakeConstructor.prototype.toString = () =>
      '[test double instance of constructor]'

    _.each(funcNames, (funcName) => {
      fakeConstructor.prototype[funcName] = tdFunction(`#${String(funcName)}`)
    })
  })
}
