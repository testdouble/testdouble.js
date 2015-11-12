_ = require('lodash')
quibble = require('quibble')
object = require('./object')
tdFunction = require('./function')

quibble.ignoreCallsFromThisFile()

module.exports = (path, stub) ->
  if arguments.length < 2 #<-- user did not specify a stub
    quibble(path, stubFor(path))
  else
    quibble(path, stub) #<-- pass-thru the user's stub without requiring thing

stubFor = (realThingPath) ->
  toBeReplaced = require(quibble.absolutify(realThingPath))
  if shouldReplaceWithObject(toBeReplaced)
    object(toBeReplaced)
  else
    tdFunction() #<-- get the func.name but write a test first

shouldReplaceWithObject = (thing) ->
  hasPrototype(thing)

hasPrototype = (thing) -> thing?.prototype?

