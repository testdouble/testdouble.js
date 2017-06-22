import _ from '../wrap/lodash'
import gatherProps from '../share/gather-props'
import copyProps from '../share/copy-props'
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
    if (names == null) names = [original.name || '(anonymous function)']
    target = tdFunction(_.compact(names).join(''))
  } else {
    if (names == null) names = [nameFromObject(original)]
    target = _.clone(original)
  }
  encounteredObjects.set(original, target)
  if (!blacklistedValueType(original)) {
    copyProps(target, gatherProps(original), (name, value) => {
      return imitate(value, concatName(names, name), encounteredObjects)
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
  [
    Boolean,
    Date,
    Number,
    RegExp,
    String,
    Symbol
  ].some(type => thing instanceof type)

const nameFromObject = (obj) => {
  const name = obj.name || _.invoke(obj, 'toString') || ''
  if (name === ({}).toString()) {
    return ''
  } else {
    return name
  }
}
