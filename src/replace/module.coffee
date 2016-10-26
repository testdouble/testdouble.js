quibble = require('quibble')
imitate = require('./imitate')
wrapIfNeeded = require('./wrap-if-needed')
imitateProperties = require('./imitate-properties')

quibble.ignoreCallsFromThisFile()
_ =
  merge: require('lodash/merge')

module.exports = (path, stub) ->
  return quibble(path, stub) if arguments.length > 1
  realThing = require(quibble.absolutify(path))
  fakeThing = imitate(realThing, path)
  quibble(path, wrapIfNeeded(fakeThing, realThing))
  return _.merge(fakeThing, imitateProperties(realThing))
