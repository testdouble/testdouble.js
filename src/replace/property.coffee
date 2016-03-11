imitate = require('./imitate')
isConstructor = require('./is-constructor')
wrapWithConstructor = require('./wrap-with-constructor')

reset = require('../reset')

module.exports = (object, property, manualReplacement) ->
  realThing = object[property]
  fakeThing = imitate(realThing, property)
  reset.onNextReset -> object[property] = realThing
  object[property] = wrapIfNeeded(fakeThing, realThing)
  return fakeThing

wrapIfNeeded = (fakeThing, realThing) ->
  if isConstructor(realThing)
    wrapWithConstructor(fakeThing)
  else
    fakeThing
