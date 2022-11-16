const accelerometer = require('./accelerometer')
const gasPedal = require('./gas-pedal')
const Brake = require('./brake')
const copilot = require('./copilot')

module.exports = {
  goSixty: function () {
    const speed = accelerometer.read()
    const brake = new Brake()

    if (speed < 60) {
      gasPedal(60 - speed)
    } else if (speed > 60) {
      brake.engage(speed - 60)
    } else {
      return copilot()
    }
  }
}
