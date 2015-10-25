_ = require('lodash')
store = require('./store')
calls = require('./store/calls')
stubbings = require('./store/stubbings')

module.exports = (nameOrType) ->
  if nameOrType?.prototype?
    createTestDoublesForEntireType(nameOrType)
  else
    createTestDouble(nameOrType)

createTestDouble = (name) ->
  _.tap createTestDoubleFunction(), (testDouble) ->
    if name?
      store.for(testDouble).name = name
      testDouble.toString = -> "[test double for \"#{name}\"]"
    else
      testDouble.toString = -> "[test double (unnamed)]"

# Refactoring TODO: this isn't at all obvious that "YO THIS FUNCTION ANONYMOUSLY
# CREATES THE ACTUAL TEST DOUBLE. Even moreso, it gets a function chucked onto
# it by the function above (toString). Seems def like a first class object ought
# to be devoted to this so it's easier to find.
createTestDoubleFunction = ->
  testDouble = (args...) ->
    calls.log(testDouble, args, this)
    stubbings.invoke(testDouble, args)

createTestDoublesForEntireType = (type) ->
  _.reduce Object.getOwnPropertyNames(type.prototype), (memo, name) ->
    memo[name] = if _.isFunction(type.prototype[name])
      createTestDouble("#{type.name}##{name}")
    else
      type.prototype[name]
    memo
  , {}
