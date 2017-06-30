import _ from '../../wrap/lodash'

import isFakeable from './is-fakeable'

export default (thing) => {
  const originalThing = thing
  const props = {}

  while (isFakeable(thing) && !isNativePrototype(thing)) {
    Object.getOwnPropertyNames(thing).forEach((propName) => {
      if (!props[propName] && propName !== 'constructor') {
        props[propName] = Object.getOwnPropertyDescriptor(thing, propName)
      }
    })
    thing = Object.getPrototypeOf(thing)
  }
  removeAbsentProperties(props, originalThing)
  return props
}

const isNativePrototype = (thing) => {
  if (!_.isFunction(thing.isPrototypeOf)) return false
  return _.some([Object, Function], (nativeType) => thing.isPrototypeOf(nativeType))
}

const removeAbsentProperties = (props, originalThing) => {
  _.each(props, (value, name) => {
    if (!(name in originalThing)) {
      delete props[name]
    }
  })
}
