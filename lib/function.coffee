_ = require('lodash')
store = require('./store')
calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = (name) ->
  _.tap createTestDoubleFunction(), (testDouble) ->
    if name?
      store.for(testDouble).name = name
      testDouble.toString = -> "[test double for \"#{name}\"]"
    else
      testDouble.toString = -> "[test double (unnamed)]"

createTestDoubleFunction = ->
  testDouble = (args...) ->
    calls.log(testDouble, args, this)
    stubbings.invoke(testDouble, args)
