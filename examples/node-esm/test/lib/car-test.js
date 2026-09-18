const assert = require('node:assert/strict')
const { describe, it, beforeEach, afterEach } = require('node:test')
const td = require('testdouble')

describe('car-test', function () {
  let gasPedal, accelerometer, Brake, subject

  beforeEach(async function () {
    gasPedal = (await td.replaceEsm('../../lib/gas-pedal.mjs')).default // <-- a plain ol' function
    accelerometer = await td.replaceEsm('../../lib/accelerometer.mjs') // <-- a named export
    Brake = (await td.replaceEsm('../../lib/brake.mjs')).default // <-- a constructor function
    await td.replaceEsm('../../lib/copilot.mjs', undefined, function () { return 'HIGHFIVE' }) // <-- a manual override
    subject = await import('../../lib/car.mjs')
  })

  afterEach(function () {
    td.reset()
  })

  it('not yet going 60 -> pushes the pedal down 5 units', function () {
    td.when(accelerometer.read()).thenReturn(55)

    subject.goSixty()

    td.verify(gasPedal(5))
  })

  it('going over 60 -> engages the brake for 2 units', function () {
    td.when(accelerometer.read()).thenReturn(62)

    subject.goSixty()

    td.verify(Brake.prototype.engage(2))
  })

  it('going exactly 60 invokes the copilot for some weird reason', function () {
    const result = subject.goSixty()

    assert.strictEqual(result, 'HIGHFIVE')
  })
})
