import _ from '../wrap/lodash'

export default (original, names) => {
  if (names != null) return names
  if (_.isFunction(original) && original.name) {
    return [original.name]
  } else {
    return []
  }
}
