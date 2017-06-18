import _ from '../wrap/lodash'

export default (thing, propNames) => {
  return _.filter(propNames, (propName) => {
    return _.isFunction(thing[propName])
  })
}
