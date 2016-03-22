imitate = require('./imitate')
isConstructor = require('./is-constructor')
wrapWithConstructor = require('./wrap-with-constructor')

reset = require('../reset')

module.exports = (object, property, manualReplacement) ->
  ensurePropertyExists(object, property)
  realThing = object[property]
  fakeThing = if arguments.length > 2 then manualReplacement else imitate(realThing, property)
  reset.onNextReset -> object[property] = realThing
  object[property] = wrapIfNeeded(fakeThing, realThing)
  return fakeThing

ensurePropertyExists = (object, property) ->
  if !object[property]
    throw new Error("td.replace error: No \"#{property}\" property was found.")

wrapIfNeeded = (fakeThing, realThing) ->
  if isConstructor(realThing)
    wrapWithConstructor(fakeThing)
  else
    fakeThing
