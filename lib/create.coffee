_ = require('lodash')
store = require('./store')
calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = (name) ->
  _.tap createTestDoubleFunction(), (testDouble) ->
    if name? then store.for(testDouble).name = name

createTestDoubleFunction = ->
  testDouble = (args...) ->
    calls.log(testDouble, args, this)
    stubbings.get(testDouble, args)
