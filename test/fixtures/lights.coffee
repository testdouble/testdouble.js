module.exports =
  count: 4
  headlight: ->
    throw 'headlight'
  turnSignal: ->
    throw 'turnSignal'
  brights: class Brights
    beBright: ->
      throw 'too bright!'
