import _ from '../../wrap/lodash'

export default function isNativePrototype (thing) {
  if (thing == null || !_.isFunction(thing.isPrototypeOf)) return false
  return _.some([Object, Function], (nativeType) =>
    Object.prototype.isPrototypeOf.call(thing, nativeType)
  )
}
