const Passenger = require('./passenger')

module.exports = {
  seatPassenger: function () {
    return new Passenger().sit()
  },
  honk: require('./honk'),
  turn: require('./turn'),
  brake: require('./brake'),
  lights: require('./lights'),
  shift: require('./shift'),
  isASpeed: function (thing) {
    return require('is-number')(thing)
  }
}
