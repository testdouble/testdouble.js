_ =
  capitalize: require('lodash/capitalize')

imitate = require('./imitate')
isConstructor = require('./is-constructor')
wrapWithConstructor = require('./wrap-with-constructor')
log = require('../log')
reset = require('../reset')
stringifyAnything = require('../stringify/anything')

module.exports = (object, property, manualReplacement) ->
  isManual = arguments.length > 2
  realThingExists = object[property] || object.hasOwnProperty(property)

  if !isManual && !realThingExists
    log.error("td.replace", "No \"#{property}\" property was found.")
  realThing = object[property]
  fakeThing = if isManual
    warnIfTypeMismatch(property, manualReplacement, realThing)
    manualReplacement
  else
    imitate(realThing, property)
  object[property] = wrapIfNeeded(fakeThing, realThing)

  reset.onNextReset ->
    if realThingExists
      object[property] = realThing
    else
      delete object[property]

  return fakeThing

wrapIfNeeded = (fakeThing, realThing) ->
  if isConstructor(realThing)
    wrapWithConstructor(fakeThing)
  else
    fakeThing

warnIfTypeMismatch = (property, fakeThing, realThing) ->
  return if realThing == undefined
  fakeType = typeof fakeThing
  realType = typeof realThing
  if fakeType != realType
    log.warn "td.replace", """
    property "#{property}" #{stringifyAnything(realThing)} (#{_.capitalize(realType)}) was replaced with #{stringifyAnything(fakeThing)}, which has a different type (#{_.capitalize(fakeType)}).
    """
