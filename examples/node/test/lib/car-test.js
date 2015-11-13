describe('Car', function(){
  var subject, gasPedal, accelerometer;
  beforeEach(function(){
    gasPedal = td.replace('../../lib/gas-pedal') //<-- a plain ol' function
    accelerometer = td.replace('../../lib/accelerometer') //<-- an obj of functions
    subject = require('../../lib/car')
  })

  describe('.goSixty', function(){
    describe('not yet going 60', function(){
      beforeEach(function(){
        td.when(accelerometer.read()).thenReturn(55)

        subject.goSixty()
      })

      it('pushes the pedal down 5 units', function(){
        td.verify(gasPedal(5))
      })
    })
  })
})
