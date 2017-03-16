let _ = require('../util/lodash-wrap')
let imitate = require('./imitate')
let log = require('../log')
let reset = require('../reset')
let stringifyAnything = require('../stringify/anything')

module.exports = function (object, property, manualReplacement) {
  let isManual = arguments.length > 2
  let realThingExists = object[property] || object.hasOwnProperty(property)

  if (isManual || realThingExists) {
    let realThing = object[property]
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
    return imitate(realThing, property)
  }
}

var warnIfTypeMismatch = function (property, fakeThing, realThing) {
  if (realThing === undefined) { return }
  let fakeType = typeof fakeThing
  let realType = typeof realThing
  if (fakeType !== realType) {
    return log.warn('td.replace', `\
property "${property}" ${stringifyAnything(realThing)} (${_.capitalize(realType)}) was replaced with ${stringifyAnything(fakeThing)}, which has a different type (${_.capitalize(fakeType)}).\
`
    )
  }
}
