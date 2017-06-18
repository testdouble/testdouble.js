import _ from './util/lodash-wrap'
import tdFunction from './function'
import config from './config'
import copyProps from './share/copy-props'
import gatherProps from './share/gather-props'
import filterFunctions from './share/filter-functions'

export default (typeOrNames) =>
  _.isFunction(typeOrNames)
    ? fakeConstructorFromType(typeOrNames)
    : fakeConstructorFromNames(typeOrNames)

var fakeConstructorFromType = (type) =>
  _.tap(createFakeType(type), (fakeType) => {
    const name = type.name || ''
    const staticProps = gatherProps(type)
    const instanceProps = gatherProps(type.prototype)
    copyProps(type, fakeType, staticProps)
    copyProps(type.prototype, fakeType.prototype, instanceProps)

    // Override "static" functions with instance test doubles
    _.each(filterFunctions(type, staticProps), funcName => {
      fakeType[funcName] = tdFunction(`${name}.${funcName}`)
    })

    // Override prototypal functions with instance test doubles
    _.each(filterFunctions(type.prototype, instanceProps), funcName => {
      fakeType.prototype[funcName] = tdFunction(`${name}#${funcName}`)
    })

    addToStringMethodsToFakeType(fakeType, name)
  })

var createFakeType = (type) => {
  const fauxConstructor = tdFunction(`${type.name || 'anonymous'} constructor`)

  if (config().extendWhenReplacingConstructors) {
    return class TestDoubleConstructorExtendingRealType extends type {
      constructor () {
        super(...arguments)
        fauxConstructor(...arguments)
      }
    }
  } else {
    return class TestDoubleConstructor {
      constructor () {
        fauxConstructor(...arguments)
      }
    }
  }
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
