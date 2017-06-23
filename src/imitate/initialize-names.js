import _ from '../wrap/lodash'

export default (original, names) => {
  if (names != null) return names
  if (_.isArray(original) || _.isArguments(original)) {
    return []
  } else if (_.isFunction(original)) {
    return [original.name]
  } else {
    let name = _.get(original, 'name') || _.invoke(original, 'toString') || ''
    if (name === ({}).toString()) {
      name = ''
    }
    return [name]
  }
}
