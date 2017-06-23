import _ from '../wrap/lodash'
import Map from 'es6-map'

import gatherProps from './gather-props'
import copyProps from './copy-props'
import tdFunction from '../function'

export default function imitate (original, names, encounteredObjects = new Map()) {
  if (!_.isObject(original)) return original
  if (encounteredObjects.has(original)) return encounteredObjects.get(original)
  if (_.isArguments(original)) original = _.toArray(original)

  // Initialize name array
  if (names == null) {
    if (_.isArray(original)) {
      names = []
    } else if (_.isFunction(original)) {
      names = [original.name]
    } else {
      let name = original.name || _.invoke(original, 'toString') || ''
      if (name === ({}).toString()) {
        name = ''
      }
      names = [name]
    }
  }

  let target
  if (_.isArray(original)) {
    target = []
  } else if (_.isFunction(original)) {
    target = tdFunction(_.compact(names).join('') || '(anonymous function)')
  } else {
    target = _.clone(original)
  }
  encounteredObjects.set(original, target)
  if (!blacklistedValueType(target)) {
    if (_.isArray(target)) {
      _.each(original, (item, index) =>
        target.push(imitate(item, names.concat(`[${index}]`), encounteredObjects))
      )
    } else {
      copyProps(target, gatherProps(original), (name, originalValue) => {
        const targetValue = imitate(originalValue, names.concat('.', name), encounteredObjects)
        if (name === 'prototype' && _.isFunction(original) && Object.hasOwnProperty.call(original, 'prototype')) {
          targetValue.__proto__ = originalValue // eslint-disable-line
          targetValue.constructor = target
        }
        return targetValue
      })
    }
  }
  return target
}

const blacklistedValueType = (thing) =>
  _.compact([
    Boolean,
    Date,
    Number,
    RegExp,
    String,
    global.Symbol
  ]).some(type => thing instanceof type)
