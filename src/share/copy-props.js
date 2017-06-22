import _ from '../wrap/lodash'

export default (target, props, visitor) => {
  Object.defineProperties(target, _.transform(props, (acc, descriptor, name) => {
    if (propOnTargetAndNotWritable(target, name, descriptor)) return
    acc[name] = {
      configurable: true,
      writable: true,
      value: visitor ? visitor(descriptor.value) : descriptor.value,
      enumerable: descriptor.enumerable
    }
  }))
}

const propOnTargetAndNotWritable = (target, name, originalDescriptor) => {
  const targetDescriptor = Object.getOwnPropertyDescriptor(target, name)
  if (targetDescriptor &&
        (!targetDescriptor.writable || !targetDescriptor.configurable)) {
    return true
  }
}
