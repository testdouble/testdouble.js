import _ from '../../wrap/lodash'

export default function isNativePrototype (thing) {
  if (!_.isFunction(thing.isPrototypeOf)) return false
  return _.some([Object, Function], (nativeType) => thing.isPrototypeOf(nativeType))
}
