import _ from '../../util/lodash-wrap'
import create from '../create'

export default create({
  name: 'contains',
  matches (containings, actualArg) {
    if (containings.length === 0) return false

    return _.every(containings, (containing) => {
      if (_.isArray(containing)) {
        return _.some(actualArg, actualElement => _.isEqual(actualElement, containing))
      } else if (_.isPlainObject(containing) && _.isPlainObject(actualArg)) {
        return containsAllSpecified(containing, actualArg)
      } else if (_.isRegExp(containing)) {
        return containing.test(actualArg)
      } else {
        return _.includes(actualArg, containing)
      }
    })
  }
})

var containsAllSpecified = (containing, actual) =>
  actual != null && _.every(containing, (val, key) =>
    _.isPlainObject(val)
      ? containsAllSpecified(val, actual[key])
      : _.isEqual(val, actual[key]))
