_ = require('./util/lodash-wrap')
store = require('./store')
calls = require('./store/calls')
stubbings = require('./store/stubbings')
copyProperties = require('./util/copy-properties')

module.exports = (nameOrFunc, __optionalName) ->
  if _.isFunction(nameOrFunc)
    createTestDoubleForFunction(nameOrFunc, __optionalName)
  else
    createTestDoubleNamed(nameOrFunc || __optionalName)

createTestDoubleForFunction = (func, optionalName) ->
  _.tap copyProperties(func, createTestDoubleNamed(func.name || optionalName)), (testDouble) ->
    _.each _.functions(func), (funcName) ->
      testDouble[funcName] = createTestDoubleNamed("#{func.name || optionalName || ''}.#{funcName}")

createTestDoubleNamed = (name) ->
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
