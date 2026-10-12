import _ from '../wrap/lodash'
import imitate from '../imitate'
import log from '../log'
import reset from '../reset'
import stringifyAnything from '../stringify/anything'

export default function (object, property, manualReplacement) {
  const isManual = arguments.length > 2
  const realThingExists = object[property] ||
    Object.prototype.hasOwnProperty.call(object, property)

  if (isManual || realThingExists) {
    const getter = findGetterOnly(object, property)
    if (getter && getter.isOwn && !getter.descriptor.configurable) {
      return log.error('td.replace', `"${property}" is defined with a getter that cannot be redefined. Compilers like SWC and Babel define ES module exports this way. To replace a module's export, replace the whole module with td.replace('path/to/module') instead.`)
    }
    const realThing = object[property]
    return _.tap(getFake(isManual, property, manualReplacement, realThing), (fakeThing) => {
      if (getter) {
        defineValue(object, property, fakeThing, getter.descriptor.enumerable)
      } else {
        object[property] = fakeThing
      }
      reset.onNextReset(() => {
        if (getter && getter.isOwn) {
          Object.defineProperty(object, property, getter.descriptor)
        } else if (getter) {
          delete object[property]
        } else if (realThingExists) {
          object[property] = realThing
        } else {
          delete object[property]
        }
      })
    })
  } else {
    log.error('td.replace', `No "${property}" property was found.`)
  }
}

// Assigning to a getter with no setter throws, so find any such accessor
// (on the object or up its prototype chain) to replace it by definition
const findGetterOnly = (object, property) => {
  let thing = object
  while (thing != null) {
    const descriptor = Object.getOwnPropertyDescriptor(thing, property)
    if (descriptor) {
      return descriptor.get && !descriptor.set
        ? { descriptor, isOwn: thing === object }
        : undefined
    }
    thing = Object.getPrototypeOf(thing)
  }
}

const defineValue = (object, property, value, enumerable) => {
  Object.defineProperty(object, property, {
    configurable: true,
    writable: true,
    enumerable,
    value
  })
}

const getFake = (isManual, property, manualReplacement, realThing) => {
  if (isManual) {
    warnIfTypeMismatch(property, manualReplacement, realThing)
    return manualReplacement
  } else {
    return imitate(realThing, [property])
  }
}

const warnIfTypeMismatch = (property, fakeThing, realThing) => {
  const fakeType = typeof fakeThing
  const realType = typeof realThing
  if (realThing !== undefined && fakeType !== realType) {
    log.warn('td.replace', `property "${property}" ${stringifyAnything(realThing)} (${_.capitalize(realType)}) was replaced with ${stringifyAnything(fakeThing)}, which has a different type (${_.capitalize(fakeType)}).`)
  }
}
