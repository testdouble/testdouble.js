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
  realThing = require(quibble.absolutify(realThingPath))
  if shouldReplaceWithObject(realThing)
    object(realThing)
  else
    tdFunction(if realThing?.name then realThing.name else realThingPath)

shouldReplaceWithObject = (thing) ->
  hasPrototype(thing)

hasPrototype = (thing) ->
  return unless thing?.prototype?
  _(thing.prototype).functions().any()

