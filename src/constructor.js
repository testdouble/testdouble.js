let _ = require('./util/lodash-wrap')
let tdFunction = require('./function')
let isConstructor = require('./replace/is-constructor')
let getAllCustomPrototypalFunctionNames = require('./util/get-all-custom-prototypal-function-names')

module.exports = (typeOrNames) =>
  isConstructor(typeOrNames)
    ? fakeConstructorFromType(typeOrNames)
    : fakeConstructorFromNames(typeOrNames)

var fakeConstructorFromType = (type) => {
  let name = type.name || ''
  let fauxConstructor = tdFunction(`${name} constructor`)

  return _.tap(class TestDoubleConstructor extends type {
    constructor () {
      super(...arguments)
      fauxConstructor(...arguments)
    }
  }, (fakeType) => {
    // Override "static" functions with instance test doubles
    _.each(_.functions(type), funcName => {
      fakeType[funcName] = tdFunction(`${name}.${funcName}`)
    })

    // Override prototypal functions with instance test doubles
    _.each(getAllCustomPrototypalFunctionNames(type), funcName => {
      fakeType.prototype[funcName] = tdFunction(`${name}#${funcName}`)
    })

    addToStringMethodsToFakeType(fakeType, name)
  })
}

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
