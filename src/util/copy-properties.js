const _ = require('./lodash-wrap')
const defineProps = Object.defineProperties
const getProps = Object.getOwnPropertyNames

module.exports = (original, target) =>
  _.tap(target, (target) => {
    defineProps(target, _.transform(getProps(original), (acc, p) => {
      if (!target.hasOwnProperty(p)) {
        acc[p] = propertyDefinitionFor(original, p)
      }
    }))
  })

var propertyDefinitionFor = (original, p) =>
  ({
    configurable: true,
    writable: true,
    value: original[p],
    enumerable: original.propertyIsEnumerable(p)
  })
