Passenger = require('./passenger')
module.exports =
  seatPassenger: ->
    new Passenger().sit()
  honk: require('./honk')
  turn: require('./turn')
  brake: require('./brake')
  lights: require('./lights')
