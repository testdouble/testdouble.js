remembersLastInvocation = require('./when/remembers-last-invocation')
stubbings = require('./store/stubbings')

module.exports = ->
  testDouble = (args...) -> #<-- return a test double
    remembersLastInvocation(testDouble, args)
    stubbings.get(testDouble, args)
