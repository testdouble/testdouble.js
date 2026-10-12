import _ from '../../wrap/lodash'

// Getters can return fresh objects with getters of their own, so cap how
// deeply getter values are expanded to keep imitation finite
const MAX_GETTER_DEPTH = 3
let getterDepth = 0

export default (target, props, visitor, original) => {
  Object.defineProperties(target, _.transform(props, (acc, descriptor, name) => {
    if (propOnTargetAndNotWritable(target, name, descriptor)) {
      if (name === 'prototype') {
        // Functions' prototype is not configurable but is assignable:
        target.prototype = valueFor(name, descriptor, original, visitor)
      }
    } else {
      acc[name] = {
        configurable: true,
        writable: true,
        value: valueFor(name, descriptor, original, visitor),
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

// Accessor properties have no `value`, so call the getter on the original
// object and imitate what it returns. Fall back to `undefined` whenever that
// isn't possible or safe
const valueFor = (name, descriptor, original, visitor) => {
  if (!('get' in descriptor)) return newValue(name, descriptor.value, visitor)
  if (!descriptor.get || original == null || getterDepth >= MAX_GETTER_DEPTH) return undefined

  getterDepth++
  try {
    if (isPrototype(original)) return undefined
    return newValue(name, descriptor.get.call(original), visitor)
  } catch (e) {
    return undefined
  } finally {
    getterDepth--
  }
}

// A prototype has no instance to act as `this`, so its getters can't be run
const isPrototype = (thing) =>
  Object.prototype.hasOwnProperty.call(thing, 'constructor') &&
  _.isFunction(thing.constructor) &&
  thing.constructor.prototype === thing

const newValue = (name, value, visitor) => {
  return visitor ? visitor(name, value) : value
}
