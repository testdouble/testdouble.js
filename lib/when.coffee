remembersLastInvocation = require('./when/remembers-last-invocation')
remembersStubbings = require('./when/remembers-stubbings')

module.exports = ->
  thenReturn: (stubbedValue) ->
    last = remembersLastInvocation.recall()
    remembersStubbings(last.testDouble, last.args, stubbedValue)

