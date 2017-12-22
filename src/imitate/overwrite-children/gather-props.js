import _ from '../../wrap/lodash'

import isFakeable from './is-fakeable'

export default function gatherProps (thing) {
  const props = {}
  while (isFakeable(thing) && !isNativePrototype(thing)) {
    Object.getOwnPropertyNames(thing).forEach((propName) => {
      if (!props[propName] && propName !== 'constructor') {
        props[propName] = Object.getOwnPropertyDescriptor(thing, propName)
      }
    })
    thing = Object.getPrototypeOf(thing)
  }
  return props
}

const isNativePrototype = (thing) => {
  if (!_.isFunction(thing.isPrototypeOf)) return false
  return _.some([Object, Function], (nativeType) => thing.isPrototypeOf(nativeType))
}
