import _ from '../wrap/lodash'
import Map from 'es6-map'

import gatherProps from './gather-props'
import copyProps from './copy-props'
import tdFunction from '../function'

export default function imitate (original, names, encounteredObjects = new Map()) {
  if (!_.isObject(original)) return original
  if (encounteredObjects.has(original)) return encounteredObjects.get(original)
  if (_.isArguments(original)) original = _.toArray(original)

  let target
  if (_.isArray(original)) {
    if (names == null) names = []
    target = _.map(original, (item, index) => {
      return imitate(item, names.concat(`[${index}]`), encounteredObjects)
    })
  } else if (_.isFunction(original)) {
    if (names == null) names = [original.name]
    target = tdFunction(_.compact(names).join('') || '(anonymous function)')
  } else {
    if (names == null) names = [nameFromObject(original)]
    target = _.clone(original)
  }
  encounteredObjects.set(original, target)
  if (!blacklistedValueType(original)) {
    copyProps(target, gatherProps(original), (name, value) => {
      if (name === 'prototype' && _.isFunction(original) && Object.hasOwnProperty.call(original, 'prototype')) {
        const extendedPrototype = imitate(Object.create(value), concatName(names, name), encounteredObjects)
        extendedPrototype.constructor = target
        return extendedPrototype
      } else {
        return imitate(value, concatName(names, name), encounteredObjects)
      }
    })
  }
  return target
}

const concatName = (names, name) => {
  if (name === 'prototype') {
    return names.concat('#')
  } else if (_.last(names) === '#') {
    return names.concat(name)
  } else {
    return names.concat('.', name)
  }
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

const nameFromObject = (obj) => {
  const name = obj.name || _.invoke(obj, 'toString') || ''
  if (name === ({}).toString()) {
    return ''
  } else {
    return name
  }
}
