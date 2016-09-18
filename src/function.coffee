_ =
  tap: require('lodash/tap')

store = require('./store')
calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = (name) ->
  _.tap createTestDoubleFunction(), (testDouble) ->
    entry = store.for(testDouble, true)
    if name?
      entry.name = name
      testDouble.toString = -> "[test double for \"#{name}\"]"
    else
      testDouble.toString = -> "[test double (unnamed)]"

createTestDoubleFunction = ->
  testDouble = (args...) ->
    calls.log(testDouble, args, this)
    stubbings.invoke(testDouble, args)
