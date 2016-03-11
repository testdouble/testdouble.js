quibble = require('quibble')
imitate = require('./imitate')
isConstructor = require('./is-constructor')
wrapWithConstructor = require('./wrap-with-constructor')

quibble.ignoreCallsFromThisFile()

module.exports = (path, stub) ->
  return quibble(path, stub) if arguments.length > 1
  realThing = require(quibble.absolutify(path))
  fakeThing = imitate(realThing, path)
  quibble(path, wrapIfNeeded(fakeThing, realThing))
  return fakeThing

wrapIfNeeded = (fakeThing, realThing) ->
  if isConstructor(realThing)
    wrapWithConstructor(fakeThing)
  else
    fakeThing
