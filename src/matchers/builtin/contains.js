import _ from '../../wrap/lodash'
import create from '../create'
import isMatcher from '../is-matcher'

export default create({
  name: 'contains',
  matches (containings, actualArg) {
    if (containings.length === 0) return false

    return _.every(containings, (containing) => {
      if (_.isArray(containing)) {
        return _.some(actualArg, actualElement => _.isEqual(actualElement, containing))
      } else if (_.isRegExp(containing)) {
        return containing.test(actualArg)
      } else if (_.isObjectLike(containing) && _.isObjectLike(actualArg)) {
        return containsAllSpecified(containing, actualArg)
      } else {
        return _.includes(actualArg, containing)
      }
    })
  }
})

var containsAllSpecified = (containing, actual) => {
  if (_.isArray(actual) && !_.isArray(containing)) {
    return _.some(actual, el => {
      if (isMatcher(containing)) {
        return containing.__matches(el)
      }
      return containsAllSpecified([containing], el)
    })
  }
  return actual != null && _.every(containing, (val, key) => {
    if (isMatcher(val)) {
      return val.__matches(actual[key])
    }
    if (_.isArray(containing)) {
      return containsAllSpecified(val, actual)
    }
    if (_.isObjectLike(val)) {
      return containsAllSpecified(val, actual[key])
    } else {
      return _.isEqual(val, actual[key])
    }
  })
}
