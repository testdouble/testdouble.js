import _ from '../wrap/lodash'

import tdFunction from '../function'

export default (original, names) => {
  let target
  if (_.isArray(original) || _.isArguments(original)) {
    target = []
  } else if (_.isFunction(original)) {
    target = tdFunction(_.compact(names).join('') || '(anonymous function)')
  } else if (_.isObject(original)) {
    target = _.clone(original)
  } else {
    target = original
  }
  return target
}
