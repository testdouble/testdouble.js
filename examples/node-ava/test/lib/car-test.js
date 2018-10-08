const test = require('ava')
const td = require('testdouble')

test.beforeEach(function (t) {
  t.context.gasPedal = td.replace('../../lib/gas-pedal') // <-- a plain ol' function
  t.context.accelerometer = td.replace('../../lib/accelerometer') // <-- an obj of functions
  t.context.Brake = td.replace('../../lib/brake') // <-- a constructor function
  td.replace('../../lib/copilot', function () { return 'HIGHFIVE' }) // <-- a manual override
  t.context.subject = require('../../lib/car')
})

test.afterEach(function (t) {
  td.reset()
})

test('not yet going 60 -> pushes the pedal down 5 units', function (t) {
  td.when(t.context.accelerometer.read()).thenReturn(55)

  t.context.subject.goSixty()

  td.verify(t.context.gasPedal(5))

  t.pass()
})

test('going over 60 -> engages the brake for 2 units', function (t) {
  td.when(t.context.accelerometer.read()).thenReturn(62)

  t.context.subject.goSixty()

  td.verify(t.context.Brake.prototype.engage(2))

  t.pass()
})

test('going exactly 60 invokes the copilot for some weird reason', function (t) {
  var result = t.context.subject.goSixty()

  t.is(result, 'HIGHFIVE')
})
