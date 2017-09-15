var subject, gasPedal, accelerometer, Brake

module.exports = {
  beforeEach: function () {
    gasPedal = td.replace('../../lib/gas-pedal') // <-- a plain ol' function
    accelerometer = td.replace('../../lib/accelerometer') // <-- an obj of functions
    Brake = td.replace('../../lib/brake') // <-- a constructor function
    td.replace('../../lib/copilot', function () { return 'HIGHFIVE' }) // <-- a manual override
    subject = require('../../lib/car')
  },

  '.goSixty': {
    'not yet going 60 -> pushes the pedal down 5 units': function () {
      td.when(accelerometer.read()).thenReturn(55)

      subject.goSixty()

      td.verify(gasPedal(5))
    },

    'going over 60 -> engages the brake for 2 units': function () {
      td.when(accelerometer.read()).thenReturn(62)

      subject.goSixty()

      td.verify(Brake.prototype.engage(2))
    },

    'going exactly 60 invokes the copilot for some weird reason': function () {
      var result = subject.goSixty()

      assert.equal(result, 'HIGHFIVE')
    }
  }
}
