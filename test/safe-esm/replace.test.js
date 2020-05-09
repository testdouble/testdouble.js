let passenger, lights, car, isPromise
module.exports = {
  'Node.js-specific ESM module replacement': {
    async beforeEach () {
      ;({ default: passenger } = await td.replaceEsm('./fixtures/passenger.mjs'))
      await td.replaceEsm('./fixtures/honk.mjs')
      await td.replaceEsm('./fixtures/turn.mjs')
      await td.replaceEsm('./fixtures/shift.mjs')
      await td.replaceEsm('./fixtures/brake.mjs', undefined, 'ANYTHING I WANT')
      lights = await td.replaceEsm('./fixtures/lights.mjs')
      isPromise = await td.replaceEsm('is-promise')
      ;({ default: car } = await require('../../notypescript/import-esm-car.js')())
    },
    'quibbling prototypal constructors get created with td.object(Type)' () {
      td.when(passenger.prototype.sit()).thenReturn('ow')

      const result = car.seatPassenger()

      assert._isEqual(result, 'ow')
    },
    'quibbling plain old functions with td.function()' () {
      assert._isEqual(car.honk.toString(), '[test double for "./fixtures/honk.mjs: .default"]')
    },
    'naming the doubles of functions with names' () {
      td.when(car.turn()).thenReturn('wee')
      td.when(car.shift()).thenReturn('Vroom')

      assert._isEqual(car.turn(), 'wee')
      assert._isEqual(car.turn.toString(), '[test double for "./fixtures/turn.mjs: .default"]')
      assert._isEqual(car.shift(), 'Vroom')
    },
    'faking property on exported function' () {
      td.when(car.neutral()).thenReturn('Clunk')

      assert._isEqual(car.neutral(), 'Clunk')
    },
    'manually stubbing an entry' () {
      assert._isEqual(car.brake, 'ANYTHING I WANT')
    },
    'an object of funcs' () {
      assert._isEqual(car.lights.headlight.toString(), '[test double for "./fixtures/lights.mjs: .headlight"]')
      assert._isEqual(car.lights.turnSignal.toString(), '[test double for "./fixtures/lights.mjs: .turnSignal"]')
      assert._isEqual(car.lights.count, 4)
    },
    'and classes on objects on funcs' () {
      td.when(lights.Brights.prototype.beBright(1)).thenReturn('yow')

      assert._isEqual((new car.lights.Brights()).beBright(1), 'yow')
    },
    'faking a 3rd party module' () {
      td.when(isPromise.default('a speed')).thenReturn(true)

      assert._isEqual(car.isASpeed('a speed'), true)
    },
    async 'post-reset usage' () {
      td.reset()

      try {
        await require('../../notypescript/import-esm-car.js')()
        assert.fail('should have errored!')
      } catch (e) {
        assert._isEqual(e.message.split("'")[0], 'Cannot find module ')
      }
    }
  }
}
