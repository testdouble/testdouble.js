remembersLastInvocation = require('./when/remembers-last-invocation')
remembersStubbings = require('./when/remembers-stubbings')

module.exports = ->
  testDouble = (args...) -> #<-- return a test double
    remembersLastInvocation(testDouble, args)
    remembersStubbings.recall(testDouble, args)
