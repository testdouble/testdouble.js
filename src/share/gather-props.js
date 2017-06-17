import _ from '../wrap/lodash'

export default (thing) => {
  const originalThing = thing
  const propNames = []

  while (!isNativePrototype(thing)) {
    Object.getOwnPropertyNames(thing).forEach((propName) => {
      if (propNames.indexOf(propName) === -1 && propName !== 'constructor') {
        propNames.push(propName)
      }
    })
    thing = Object.getPrototypeOf(thing)
  }

  return excludePropertiesNotOnThing(propNames, originalThing)
}

const isNativePrototype = (thing) => {
  if (!_.isFunction(thing.isPrototypeOf)) return false
  return _.some([Object, Function], (nativeType) => thing.isPrototypeOf(nativeType))
}

const excludePropertiesNotOnThing = (propNames, originalThing) =>
  _.filter(propNames, (name) => name in originalThing)
