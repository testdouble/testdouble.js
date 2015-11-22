_ = require('lodash')
quibble = require('quibble')
object = require('./object')
tdFunction = require('./function')

quibble.ignoreCallsFromThisFile()

module.exports = (path, stub) ->
  return quibble(path, stub) if arguments.length > 1
  realThing = require(quibble.absolutify(path))
  if isConstructorFunc(realThing)
    funcBag = object(realThing)
    quibble(path, wrapConstructorAround(funcBag))
    funcBag
  else if _.isPlainObject(realThing)
    quibble(path, object(realThing))
  else
    quibble(path, tdFunction(if realThing?.name then realThing.name else path))

wrapConstructorAround = (testDoubleFunctionBag) ->
  constructor = (class TestDoubleConstructor)
  _.each testDoubleFunctionBag, (func, name) ->
    TestDoubleConstructor.prototype[name] = func
  constructor

isConstructorFunc = (thing) ->
  return unless thing?.prototype?
  _(thing.prototype).functions().any()

