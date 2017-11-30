import _ from '../wrap/lodash'
import imitate from '../imitate'
import log from '../log'
import reset from '../reset'
import stringifyAnything from '../stringify/anything'

export default function (object, property, manualReplacement) {
  const isManual = arguments.length > 2
  const realThingExists = object[property] || object.hasOwnProperty(property)

  if (isManual || realThingExists) {
    const realThing = object[property]
    return _.tap(getFake(isManual, property, manualReplacement, realThing), (fakeThing) => {
      object[property] = fakeThing
      reset.onNextReset(() => {
        if (realThingExists) {
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

var getFake = (isManual, property, manualReplacement, realThing) => {
  if (isManual) {
    warnIfTypeMismatch(property, manualReplacement, realThing)
    return manualReplacement
  } else {
    return imitate(realThing, [property])
  }
}

var warnIfTypeMismatch = (property, fakeThing, realThing) => {
  const fakeType = typeof fakeThing
  const realType = typeof realThing
  if (realThing !== undefined && fakeType !== realType) {
    log.warn('td.replace', `property "${property}" ${stringifyAnything(realThing)} (${_.capitalize(realType)}) was replaced with ${stringifyAnything(fakeThing)}, which has a different type (${_.capitalize(fakeType)}).`)
  }
}
