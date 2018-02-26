import isFakeable from './is-fakeable'
import isNativePrototype from './is-native-prototype'

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
