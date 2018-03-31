import _ from '../../wrap/lodash'
import create from '../create'
import isMatcher from '../is-matcher'

export default create({
  name: 'contains',
  matches (containings, actualArg) {
    if (containings.length === 0) return false

    return _.every(containings, (containing) =>
      argumentContains(containing, actualArg)
    )
  }
})

const argumentContains = function (containing, actualArg) {
  if (_.isArray(containing)) {
    return _.some(actualArg, actualElement =>
      _.isEqualWith(containing, actualElement, equalish))
  } else {
    return _.isEqualWith(containing, actualArg, equalish)
  }
}

const equalish = function (containing, actualArg) {
  if (_.isRegExp(containing)) {
    if (_.isString(actualArg)) {
      return containing.test(actualArg)
    } else if (_.isRegExp(actualArg)) {
      return containing.toString() === actualArg.toString()
    } else {
      return false
    }
  } else if (isMatcher(containing)) {
    return containing.__matches(actualArg) ||
      _.some(actualArg, containing.__matches)
  } else if (containing instanceof Date) {
    return actualArg instanceof Date &&
      containing.getTime() === actualArg.getTime()
  } else if (containing instanceof Error) {
    return actualArg instanceof Error &&
      _.includes(actualArg.message, containing.message)
  } else if (_.isObjectLike(containing) && _.isObjectLike(actualArg)) {
    return containsPartialObject(containing, actualArg)
  } else if (_.isString(actualArg) || _.isArray(actualArg)) {
    return _.includes(actualArg, containing)
  } else {
    _.isEqual(actualArg, containing)
  }
}

const containsPartialObject = (containing, actual) => {
  return _.every(containing, (val, key) =>
    _.isEqualWith(val, actual[key], equalish)
  )
}
