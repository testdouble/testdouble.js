import _ from '../wrap/lodash'

export default (original, target, props) => {
  Object.defineProperties(target, _.transform(props, (acc, name) => {
    if (!(name in original) || name in target) return
    acc[name] = {
      configurable: true,
      writable: true,
      value: original[name],
      enumerable: Object.propertyIsEnumerable(original, name)
    }
  }))
}
