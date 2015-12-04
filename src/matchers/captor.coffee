module.exports = ->
  captor =
    capture: ->
      __matches: (actual) ->
        captor.value = actual
        return true
