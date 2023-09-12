import assert from 'assert'
import mocha from 'mocha'
import * as td from 'testdouble'

mocha.describe('car-test', function () {
  mocha.beforeEach(async function () {
    this.gasPedal = (await td.replaceEsm('../../lib/gas-pedal.mjs')).default // <-- a plain ol' function
    this.accelerometer = await td.replaceEsm('../../lib/accelerometer.mjs') // <-- a named export
    this.Brake = (await td.replaceEsm('../../lib/brake.mjs')).default // <-- a constructor function
    await td.replaceEsm('../../lib/copilot.mjs', undefined, function () { return 'HIGHFIVE' }) // <-- a manual override
    this.subject = await import('../../lib/car.mjs')
  })

  mocha.afterEach(function () {
    td.reset()
  })

  mocha.it('not yet going 60 -> pushes the pedal down 5 units', function () {
    td.when(this.accelerometer.read()).thenReturn(55)

    this.subject.goSixty()

    td.verify(this.gasPedal(5))
  })

  mocha.it('going over 60 -> engages the brake for 2 units', function () {
    td.when(this.accelerometer.read()).thenReturn(62)

    this.subject.goSixty()

    td.verify(this.Brake.prototype.engage(2))
  })

  mocha.it('going exactly 60 invokes the copilot for some weird reason', function () {
    const result = this.subject.goSixty()

    assert.strictEqual(result, 'HIGHFIVE')
  })
})
