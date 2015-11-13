accelerometer = require('./accelerometer')
gasPedal = require('./gas-pedal')
Brake = require('./brake')

module.exports = {
  goSixty: function(){
    var speed = accelerometer.read(),
        brake = new Brake()
    if(speed < 60) {
      gasPedal(60 - speed)
    } else {
      brake.engage(speed - 60)
    }
  }
}
