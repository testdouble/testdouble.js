calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = ->
  testDouble = (args...) -> #<-- return a test double
    calls.log(testDouble, args, this)
    stubbings.get(testDouble, args)
