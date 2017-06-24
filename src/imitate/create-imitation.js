import _ from '../wrap/lodash'

import tdFunction from '../function'

export default (original, names) => {
  if (_.isArray(original) || _.isArguments(original)) {
    return []
  } else if (_.isFunction(original)) {
    return tdFunction(names.join('') || '(anonymous function)')
  } else {
    return _.clone(original)
  }
}
