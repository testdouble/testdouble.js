import _ from '../wrap/lodash'
import gatherProps from '../share/gather-props'
import copyProps from '../share/copy-props'
import tdFunction from '../function'

export default function imitate(original, encounteredObjects = new Map()) {
  if (!_.isObject(original)) return original
  if (encounteredObjects.has(original)) return encounteredObjects.get(original)

  let target
  if (_.isArray(original) || _.isArguments(original)) {
    target = _.map(original, (item) => {
      return imitate(item, encounteredObjects)
    })
  } else if (_.isFunction(original)) {
    target = tdFunction(original)
  } else {
    target = _.clone(original)
  }
  encounteredObjects.set(original, target)
  copyProps(original, target, gatherProps(original), (value) => {
    return imitate(value, encounteredObjects)
  })
  return target
}
