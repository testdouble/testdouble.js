_ = require('lodash')
store = require('./store')
calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = (name, options = {}) ->
  _.tap createTestDoubleFunction(name, options), (testDouble) ->
    if name?
      store.for(testDouble).name = name
      testDouble.toString = -> "[test double for \"#{name}\"]"
    else
      testDouble.toString = -> "[test double (unnamed)]"

createTestDoubleFunction = (name, options)->
  testDouble = (args...) ->
    calls.log(testDouble, args, this)
    if options.log
      console.log("Test Double Function '%s' called with: ", name, args)
    stubbings.invoke(testDouble, args)
