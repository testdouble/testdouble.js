import initializeNames from './initialize-names'
import createImitation from './create-imitation'
import overwriteChildren from './overwrite-children'

export default function imitate (original, names, encounteredObjects = new Map()) {
  if (encounteredObjects.has(original)) return encounteredObjects.get(original)
  names = initializeNames(original, names)
  const target = createImitation(original, names)
  encounteredObjects.set(original, target)
  overwriteChildren(original, target, (originalValue, name) =>
    imitate(originalValue, names.concat(name), encounteredObjects)
  )
  return target
}
