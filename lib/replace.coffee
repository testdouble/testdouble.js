_ = require('lodash')
quibble = require('quibble')
object = require('./object')
tdFunction = require('./function')

quibble.ignoreCallsFromThisFile()

module.exports = (path, stub) ->
  return quibble(path, stub) if arguments.length > 1
  quibble(path, stubFor(path))

stubFor = (realThingPath) ->
  realThing = require(quibble.absolutify(realThingPath))
  if shouldReplaceWithObject(realThing)
    object(realThing)
  else
    tdFunction(if realThing?.name then realThing.name else realThingPath)

shouldReplaceWithObject = (thing) ->
  hasPrototype(thing) || _.isPlainObject(thing)

hasPrototype = (thing) ->
  return unless thing?.prototype?
  _(thing.prototype).functions().any()

