quibble = require('quibble')
object = require('./object')

quibble.ignoreCallsFromThisFile()

module.exports = (path) ->
  toBeReplaced = require(quibble.absolutify(path))
  quibble(path, object(toBeReplaced))
