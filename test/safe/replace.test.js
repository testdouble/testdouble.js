let dependency, ogWarn, warnings, passenger, lights, isNumber, car
module.exports = {
  'Replacing properties on objects and restoring them with reset': {
    beforeEach () {
      function Thing () {}
      Thing.prototype.foo = function () { return 'og foo' }
      Thing.prototype.bar = function () { return 'og bar' }
      dependency = {
        honk: () => 'og honk',
        ThingConstructor: Thing
      }
    },
    'Replacing a function' () {
      const double = td.replace(dependency, 'honk')

      assert._isEqual(td.explain(double).isTestDouble, true)
      assert._isEqual(double, dependency.honk)

      // phase 2: and then resetting it
      td.reset()

      assert._isEqual(td.explain(double).isTestDouble, false)
      assert._isEqual(dependency.honk(), 'og honk')
    },
    'Replacing a constructor function' () {
      const fakeConstructor = td.replace(dependency, 'ThingConstructor')

      assert._isEqual(td.explain(fakeConstructor.prototype.foo).isTestDouble, true)
      assert._isEqual(td.explain(fakeConstructor.prototype.bar).isTestDouble, true)
      assert._isEqual(fakeConstructor.prototype.foo, new dependency.ThingConstructor().foo)
      assert._isEqual(fakeConstructor.prototype.bar, new dependency.ThingConstructor().bar)

      // phase 2: reset restores it
      td.reset()

      assert._isEqual(td.explain(new dependency.ThingConstructor().foo).isTestDouble, false)
      assert._isEqual(new dependency.ThingConstructor().foo(), 'og foo')
    },
    'Replacing an ES6 constructor function' () {
      dependency.Es6constructor = require('./fixtures/es6class')
      const fakeConstructor = td.replace(dependency, 'Es6constructor')
      const es6Thing = new dependency.Es6constructor()

      td.when(fakeConstructor.prototype.foo('cat')).thenReturn('dog')

      assert._isEqual(td.explain(fakeConstructor.prototype.foo).isTestDouble, true)
      assert._isEqual(td.explain(fakeConstructor.prototype.bar).isTestDouble, true)
      assert._isEqual(fakeConstructor.prototype.foo, es6Thing.foo)
      assert._isEqual(fakeConstructor.prototype.bar, es6Thing.bar)
      assert._isEqual(es6Thing.foo('cat'), 'dog')

      // phase 2: reset
      td.reset()

      assert._isEqual(td.explain(new dependency.Es6constructor().foo).isTestDouble, false)
      assert._isEqual(new dependency.Es6constructor().foo(), 'og foo')
    },
    'Replacing a method on an object instantiated with `new`' () {
      const thing = new dependency.ThingConstructor()

      td.replace(thing, 'foo')

      assert._isEqual(td.explain(thing.foo).isTestDouble, true)
      assert._isEqual(thing.foo(), undefined)

      // phase 2: reset
      td.reset()

      assert._isEqual(td.explain(thing.foo).isTestDouble, false)
      assert._isEqual(thing.foo(), 'og foo')
    },
    'Replacing an object / function bag' () {
      function horseClass () {}
      horseClass.prototype.nay = () => 'nay'
      dependency.animals = {
        bark: () => 'og bark',
        woof: () => 'og woof',
        age: 18,
        Horse: horseClass
      }
      const doubleBag = td.replace(dependency, 'animals')
      td.when(doubleBag.Horse.prototype.nay('hay')).thenReturn('no way')

      assert._isEqual(td.explain(doubleBag.bark).isTestDouble, true)
      assert._isEqual(td.explain(doubleBag.woof).isTestDouble, true)
      assert._isEqual(doubleBag.bark, dependency.animals.bark)
      assert._isEqual(doubleBag.woof, dependency.animals.woof)
      assert._isEqual(doubleBag.age, 18)
      assert._isEqual((new dependency.animals.Horse()).nay('hay'), 'no way')
    },
    'Replacing an object with Object.create' () {
      dependency = {
        foo: Object.create({
          bar: function () {}
        })
      }

      td.replace(dependency, 'foo')

      assert._isEqual(td.explain(dependency.foo.bar).isTestDouble, true)
    },
    'Replacing a property that is not an object/function': {
      'number' () {
        dependency.badType = 5

        const result = td.replace(dependency, 'badType')

        assert._isEqual(result, 5)
      },
      'string' () {
        dependency.badType = 'hello'

        const result = td.replace(dependency, 'badType')

        assert._isEqual(result, 'hello')
      },
      'null' () {
        dependency.badType = null

        const result = td.replace(dependency, 'badType')

        assert._isEqual(result, null)
      },
      'undefined' () {
        dependency.badType = undefined

        const result = td.replace(dependency, 'badType')

        assert._isEqual(result, undefined)
      }
    },
    'Replacing a non-existent property': {
      'using automatic replacement' () {
        try {
          td.replace(dependency, 'notAThing')
          assert.fail('should error!')
        } catch (e) {
          assert._isEqual(e.message, 'Error: testdouble.js - td.replace - No "notAThing" property was found.')
        }
      },
      'with manual replacement' () {
        const myFake = td.replace(dependency, 'notAThing', 'MY FAKE')

        assert._isEqual(myFake, 'MY FAKE')
        assert._isEqual(myFake, dependency.notAThing)

        // phase 2: reset
        td.reset()
        assert._isEqual(Object.prototype.hasOwnProperty.call(dependency, 'notAThing'), false)
      }
    },
    'Replacing a property defined with a getter': {
      'own and configurable (tsc re-exports)': {
        beforeEach () {
          Object.defineProperty(dependency, 'beep', {
            configurable: true,
            enumerable: true,
            get: () => () => 'og beep'
          })
        },
        'using automatic replacement' () {
          const ogDescriptor = Object.getOwnPropertyDescriptor(dependency, 'beep')

          const double = td.replace(dependency, 'beep')

          assert._isEqual(td.explain(double).isTestDouble, true)
          assert._isEqual(dependency.beep, double)

          // phase 2: reset puts the getter itself back
          td.reset()
          assert._isEqual(Object.getOwnPropertyDescriptor(dependency, 'beep'), ogDescriptor)
          assert._isEqual(dependency.beep(), 'og beep')
        },
        'with manual replacement' () {
          const ogDescriptor = Object.getOwnPropertyDescriptor(dependency, 'beep')

          const fake = td.replace(dependency, 'beep', () => 'fake beep')

          assert._isEqual(dependency.beep, fake)

          // phase 2: reset puts the getter itself back
          td.reset()
          assert._isEqual(Object.getOwnPropertyDescriptor(dependency, 'beep'), ogDescriptor)
        }
      },
      'inherited from a class': {
        beforeEach () {
          class Horn {
            get beep () { return () => 'og beep' }
          }
          dependency = new Horn()
        },
        'using automatic replacement' () {
          const double = td.replace(dependency, 'beep')

          assert._isEqual(td.explain(double).isTestDouble, true)
          assert._isEqual(dependency.beep, double)
          assert._isEqual(Object.prototype.hasOwnProperty.call(dependency, 'beep'), true)

          // phase 2: reset uncovers the inherited getter again
          td.reset()
          assert._isEqual(Object.prototype.hasOwnProperty.call(dependency, 'beep'), false)
          assert._isEqual(dependency.beep(), 'og beep')
        },
        'with manual replacement' () {
          const fake = td.replace(dependency, 'beep', () => 'fake beep')

          assert._isEqual(dependency.beep, fake)

          // phase 2: reset uncovers the inherited getter again
          td.reset()
          assert._isEqual(Object.prototype.hasOwnProperty.call(dependency, 'beep'), false)
          assert._isEqual(dependency.beep(), 'og beep')
        }
      },
      'own and non-configurable (SWC exports)': {
        beforeEach () {
          Object.defineProperty(dependency, 'beep', {
            enumerable: true,
            get: () => () => 'og beep'
          })
        },
        'using automatic replacement' () {
          const ogDescriptor = Object.getOwnPropertyDescriptor(dependency, 'beep')

          try {
            td.replace(dependency, 'beep')
            assert.fail('should error!')
          } catch (e) {
            assert._isEqual(e.message, 'Error: testdouble.js - td.replace - "beep" is defined with a getter that cannot be redefined. Compilers like SWC and Babel define ES module exports this way. To replace a module\'s export, replace the whole module with td.replace(\'path/to/module\') instead.')
          }
          assert._isEqual(Object.getOwnPropertyDescriptor(dependency, 'beep'), ogDescriptor)
        },
        'with manual replacement' () {
          const ogDescriptor = Object.getOwnPropertyDescriptor(dependency, 'beep')

          try {
            td.replace(dependency, 'beep', () => 'fake beep')
            assert.fail('should error!')
          } catch (e) {
            assert._isEqual(e.message, 'Error: testdouble.js - td.replace - "beep" is defined with a getter that cannot be redefined. Compilers like SWC and Babel define ES module exports this way. To replace a module\'s export, replace the whole module with td.replace(\'path/to/module\') instead.')
          }
          assert._isEqual(Object.getOwnPropertyDescriptor(dependency, 'beep'), ogDescriptor)
        }
      },
      'with a setter': {
        beforeEach () {
          let beep = () => 'og beep'
          Object.defineProperty(dependency, 'beep', {
            configurable: true,
            enumerable: true,
            get: () => beep,
            set: (value) => { beep = value }
          })
        },
        'using automatic replacement' () {
          const ogDescriptor = Object.getOwnPropertyDescriptor(dependency, 'beep')

          const double = td.replace(dependency, 'beep')

          assert._isEqual(td.explain(double).isTestDouble, true)
          assert._isEqual(dependency.beep, double)
          assert._isEqual(Object.getOwnPropertyDescriptor(dependency, 'beep'), ogDescriptor)

          // phase 2: reset restores through the setter
          td.reset()
          assert._isEqual(dependency.beep(), 'og beep')
        },
        'with manual replacement' () {
          const fake = td.replace(dependency, 'beep', () => 'fake beep')

          assert._isEqual(dependency.beep, fake)

          // phase 2: reset restores through the setter
          td.reset()
          assert._isEqual(dependency.beep(), 'og beep')
        }
      }
    },
    'Manually specifying the override': {
      beforeEach () {
        ogWarn = console.warn
        warnings = []
        console.warn = (msg) => {
          warnings.push(msg)
        }
      },
      afterEach () {
        console.warn = ogWarn
      },
      'with a matching type' () {
        const originalHonk = dependency.honk
        const myDouble = td.replace(dependency, 'honk', function () {
          return 'FAKE THING'
        })

        assert._isEqual(myDouble(), 'FAKE THING')
        assert._isEqual(myDouble, dependency.honk)
        assert._isEqual(warnings.length, 0)

        // phase 2: reset
        td.reset()
        assert._isEqual(dependency.honk, originalHonk)
      },
      'with mismatched types' () {
        dependency.lol = 5

        td.replace(dependency, 'lol', 'foo')

        assert._isEqual(warnings[0], 'Warning: testdouble.js - td.replace - property "lol" 5 (Number) was replaced with "foo", which has a different type (String).')
      },
      'where the actual is not defined' () {
        td.replace(dependency, 'naw', 'lol')

        assert._isEqual(warnings.length, 0)
      }
    }
  },
  'Node.js-specific CJS module replacement': {

    beforeEach () {
      passenger = td.replace('./fixtures/passenger')
      td.replace('./fixtures/honk')
      td.replace('./fixtures/turn')
      td.replace('./fixtures/shift')
      td.replace('./fixtures/brake', 'ANYTHING I WANT')
      lights = td.replace('./fixtures/lights')
      isNumber = td.replace('is-number')
      car = require('./fixtures/car')
    },
    'quibbling prototypal constructors get created with td.object(Type)' () {
      td.when(passenger.prototype.sit()).thenReturn('ow')

      const result = car.seatPassenger()

      assert._isEqual(result, 'ow')
    },
    'quibbling plain old functions with td.function()' () {
      assert._isEqual(car.honk.toString(), '[test double for "./fixtures/honk: (anonymous function)"]')
    },
    'naming the doubles of functions with names' () {
      td.when(car.turn()).thenReturn('wee')
      td.when(car.shift()).thenReturn('Vroom')

      assert._isEqual(car.turn(), 'wee')
      assert._isEqual(car.turn.toString(), '[test double for "./fixtures/turn: turn"]')
      assert._isEqual(car.shift(), 'Vroom')
    },
    'faking property on exported function' () {
      td.when(car.shift.neutral()).thenReturn('Clunk')

      assert._isEqual(car.shift.neutral(), 'Clunk')
    },
    'manually stubbing an entry' () {
      assert._isEqual(car.brake, 'ANYTHING I WANT')
    },
    'an object of funcs' () {
      assert._isEqual(car.lights.headlight.toString(), '[test double for "./fixtures/lights: .headlight"]')
      assert._isEqual(car.lights.turnSignal.toString(), '[test double for "./fixtures/lights: .turnSignal"]')
      assert._isEqual(car.lights.count, 4)
    },
    'and classes on objects on funcs' () {
      td.when(lights.Brights.prototype.beBright(1)).thenReturn('yow')

      assert._isEqual((new car.lights.Brights()).beBright(1), 'yow')
    },
    'faking a 3rd party module' () {
      td.when(isNumber('a speed')).thenReturn(true)

      assert._isEqual(car.isASpeed('a speed'), true)
    },
    'a module whose exports are getters' () {
      const getterExports = td.replace('./fixtures/getter-exports')

      assert._isEqual(td.explain(getterExports.doTheThing).isTestDouble, true)
      assert._isEqual(td.explain(getterExports.beep).isTestDouble, true)
      td.when(getterExports.doTheThing()).thenReturn(123)
      assert._isEqual(require('./fixtures/getter-exports').doTheThing(), 123)
    },
    'post-reset usage' () {
      td.reset()

      try {
        require('./fixtures/car')
        assert.fail('should have errored!')
      } catch (e) {
        assert._isEqual(e.message.split('\n')[0], "Cannot find module './brake'")
      }
    }
  }
}
