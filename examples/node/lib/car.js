accelerometer = require('./accelerometer')
gasPedal = require('./gas-pedal')
Brake = require('./brake')
copilot = require('./copilot')

module.exports = {
  goSixty: function(){
    var speed = accelerometer.read(),
        brake = new Brake()
    if(speed < 60) {
      gasPedal(60 - speed)
    } else if(speed > 60) {
      brake.engage(speed - 60)
    } else {
      return copilot()
    }
  }
}
