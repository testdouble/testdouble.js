import _ from '../wrap/lodash'

import gatherProps from './gather-props'
import copyProps from './copy-props'

export default (original, target, overwriteChild) => {
  if (!blacklistedValueType(target)) {
    if (_.isArray(target)) {
      _.each(original, (item, index) =>
        target.push(overwriteChild(item, `[${index}]`))
      )
    } else {
      copyProps(target, gatherProps(original), (name, originalValue) => {
        const targetValue = overwriteChild(originalValue, '.' + name)
        if (name === 'prototype' && _.isFunction(original) && Object.hasOwnProperty.call(original, 'prototype')) {
          targetValue.__proto__ = originalValue // eslint-disable-line
          targetValue.constructor = target
        }
        return targetValue
      })
    }
  }
}

const blacklistedValueType = (thing) =>
  !_.isObject(thing) || _.compact([
    Boolean,
    Date,
    Number,
    RegExp,
    String,
    global.Symbol
  ]).some(type => thing instanceof type)
