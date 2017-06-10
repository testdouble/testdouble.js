import _ from '../../wrap/lodash'

export default (original, target) => {
  const descriptors = _.transform(Object.getOwnPropertyNames(original), (acc, name) => {
    if (target.hasOwnProperty(name)) return
    acc[name] = {
      configurable: true,
      writable: true,
      value: original[name],
      enumerable: Object.propertyIsEnumerable(original, name)
    }
  })
  Object.defineProperties(target, descriptors)
}
