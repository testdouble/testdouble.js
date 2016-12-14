quibble = require('quibble')
imitate = require('./imitate')
wrapIfNeeded = require('./wrap-if-needed')

quibble.ignoreCallsFromThisFile()

module.exports = (path, stub) ->
  return quibble(path, stub) if arguments.length > 1
  realThing = require(quibble.absolutify(path))
  fakeThing = imitate(realThing, path)
  quibble(path, wrapIfNeeded(fakeThing, realThing))
  return fakeThing


