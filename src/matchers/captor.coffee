create = require('./create')

module.exports = ->
  captor =
    capture: create
      name: 'captor.capture'
      matches: (matcherArgs, actual) ->
        if not captor.values
            captor.values = []
        captor.values.push actual
        captor.value = actual
        return true

