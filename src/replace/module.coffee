quibble = require('quibble')
imitate = require('./imitate')
imitateProperties = require('./imitate-properties')

quibble.ignoreCallsFromThisFile()
_ =
  merge: require('lodash/merge')

module.exports = (path, stub) ->
  return quibble(path, stub) if arguments.length > 1
  realThing = require(quibble.absolutify(path))
  fakeThing = imitate(realThing, path)
  quibble(path, fakeThing)
  return _.merge(fakeThing, imitateProperties(realThing))
