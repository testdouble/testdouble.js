const quibble = require('quibble')
const imitate = require('./imitate')

quibble.ignoreCallsFromThisFile()

module.exports = function (path, stub) {
  if (arguments.length > 1) { return quibble(path, stub) }
  const realThing = require(quibble.absolutify(path))
  const fakeThing = imitate(realThing, path)
  quibble(path, fakeThing)
  return fakeThing
}
