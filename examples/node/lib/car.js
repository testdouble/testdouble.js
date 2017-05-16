var accelerometer = require('./accelerometer')
var gasPedal = require('./gas-pedal')
var Brake = require('./brake')
var copilot = require('./copilot')

module.exports = {
  goSixty: function () {
    var speed = accelerometer.read()
    var brake = new Brake()

    if (speed < 60) {
      gasPedal(60 - speed)
    } else if (speed > 60) {
      brake.engage(speed - 60)
    } else {
      return copilot()
    }
  }
}
