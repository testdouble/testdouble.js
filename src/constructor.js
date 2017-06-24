import _ from './util/lodash-wrap'
import tdFunction from './function'
import imitate from './imitate'

export default (typeOrNames) =>
  _.isFunction(typeOrNames)
    ? imitate(typeOrNames)
    : fakeConstructorFromNames(typeOrNames)

var fakeConstructorFromNames = (funcNames) => {
  return _.tap(class TestDoubleConstructor {}, (cls) => {
    _.each(funcNames, (funcName) => {
      cls.prototype[funcName] = tdFunction(`#${funcName}`)
    })

    addToStringMethodsToFakeType(cls)
  })
}

var addToStringMethodsToFakeType = (fakeType, name) => {
  fakeType.toString = () =>
    `[test double constructor${name ? ` for "${name}"` : ''}]`

  fakeType.prototype.toString = () =>
    `[test double instance of constructor${name ? ` "${name}"` : ''}]`
}
