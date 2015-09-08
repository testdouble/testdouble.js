remembersLastInvocation = require('./when/remembers-last-invocation')
stubbings = require('./store/stubbings')

module.exports = ->
  thenReturn: (stubbedValue) ->
    last = remembersLastInvocation.recall()
    stubbings.add(last.testDouble, stubbedValue, last.args)
    last.testDouble

