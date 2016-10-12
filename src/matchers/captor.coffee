create = require('./create')

module.exports = ->
  captor =
    capture: create
      name: 'captor.capture'
      matches: (matcherArgs, actual) ->
        captor.values ||= []
        captor.values.push actual
        captor.value = actual
        return true