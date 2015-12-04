quibble = require('quibble')

module.exports = ->
  require('./store').reset()
  quibble.reset?()

