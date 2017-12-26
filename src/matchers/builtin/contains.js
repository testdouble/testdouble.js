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
      } else if (isMatcher(containing)) {
        return _.some(actualArg, containing.__matches)
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
  return actual != null && _.every(containing, (val, key) => {
    if (isMatcher(val)) {
      return val.__matches(actual[key])
    } else if (_.isArray(containing)) {
      return containsAllSpecified(val, actual)
    } else if (_.isObjectLike(val)) {
      return containsAllSpecified(val, actual[key])
    } else {
      return _.isEqual(val, actual[key])
    }
  })
}
