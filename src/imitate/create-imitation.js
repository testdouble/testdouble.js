import _ from '../wrap/lodash'

import tdFunction from '../function'
import isGenerator from './is-generator'

export default (original, names) => {
  if (_.isArray(original) || _.isArguments(original)) {
    return []
  } else if (_.isFunction(original)) {
    if (isGenerator(original)) {
      return original
    } else {
      return tdFunction(names.join('') || '(anonymous function)')
    }
  } else {
    return _.clone(original)
  }
}
