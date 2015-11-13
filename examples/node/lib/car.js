accelerometer = require('./accelerometer')
gasPedal = require('./gas-pedal')

module.exports = {
  goSixty: function(){
    gasPedal(60 - accelerometer.read())
  }
}
