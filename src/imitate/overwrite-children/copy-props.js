import _ from '../../wrap/lodash'

export default (target, props, visitor) => {
  Object.defineProperties(target, _.transform(props, (acc, descriptor, name) => {
    if (propOnTargetAndNotWritable(target, name, descriptor)) {
      if (name === 'prototype') {
        // Functions' prototype is not configurable but is assignable:
        target.prototype = newValue(name, descriptor.value, visitor)
      }
    } else {
      acc[name] = {
        configurable: true,
        writable: true,
        value: newValue(name, descriptor.value, visitor),
        enumerable: descriptor.enumerable
      }
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

const newValue = (name, value, visitor) => {
  return visitor ? visitor(name, value) : value
}
