import _ from '../../wrap/lodash'

export default (original, target, name, originalValue, targetValue) => {
  if (name !== 'prototype' || !_.isFunction(original)) return targetValue

  targetValue.__proto__ = originalValue // eslint-disable-line
  targetValue.constructor = target
  return targetValue
}
