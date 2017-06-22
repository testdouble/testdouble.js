import _ from '../wrap/lodash'

export default (props) => {
  return _.compact(_.map(props, (descriptor, name) => {
    if (_.isFunction(descriptor.value)) return name
  }))
}
