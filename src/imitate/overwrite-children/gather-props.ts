import isFakeable from './is-fakeable'
import isNativePrototype from './is-native-prototype'

type PropertyDescriptors<T> = {
  [P in keyof T]: PropertyDescriptor
}

export default function gatherProps <T>(thing: T): PropertyDescriptors<T> {
  const props = {} as PropertyDescriptors<T>
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
