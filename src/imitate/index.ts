
import initializeNames from './initialize-names'
import createImitation from './create-imitation'
import overwriteChildren from './overwrite-children'

export default function imitate<T> (original: T, originalNames?: string | string[], encounteredObjects = new Map()): T {
  if (encounteredObjects.has(original)) return encounteredObjects.get(original)
  const names = initializeNames(original, originalNames)
  const target = createImitation(original, names)
  encounteredObjects.set(original, target)
  overwriteChildren(original, target, (originalValue, name) =>
    imitate(originalValue, names.concat(name), encounteredObjects)
  )
  return target
}
