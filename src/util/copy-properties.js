import _ from './lodash-wrap'

const defineProps = Object.defineProperties
const getProps = Object.getOwnPropertyNames

export default (original, target) =>
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
