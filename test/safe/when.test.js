let testDouble, result
module.exports = {
  beforeEach () {
    testDouble = td.function()
  },
  'no-arg stubbing': {
    'foo' () {
      td.when(testDouble()).thenReturn('foo')

      assert._isEqual(testDouble(), 'foo')
    },
    'bar' () {
      td.when(testDouble()).thenReturn('bar')

      assert._isEqual(testDouble(), 'bar')
    }
  },
  'last-in-wins overwriting' () {
    td.when(testDouble('something')).thenReturn('gold')
    td.when(testDouble('something')).thenReturn('iron')

    assert._isEqual(testDouble('something'), 'iron')
  },
  'conditional stubbing' () {
    td.when(testDouble(1)).thenReturn('foo')
    td.when(testDouble(2)).thenReturn('bar')
    td.when(testDouble({ lol: 'cheese' })).thenReturn('nom')
    td.when(testDouble({ lol: 'fungus' })).thenReturn('eww')
    td.when(testDouble({ lol: 'fungus' }, 2)).thenReturn('eww2')

    assert._isEqual(testDouble(), undefined)
    assert._isEqual(testDouble(1), 'foo')
    assert._isEqual(testDouble(2), 'bar')
    assert._isEqual(testDouble({ lol: 'cheese' }), 'nom')
    assert._isEqual(testDouble({ lol: 'fungus' }), 'eww')
    assert._isEqual(testDouble({ lol: 'fungus' }, 2), 'eww2')
  },
  'multiple test doubles' () {
    const td1 = td.when(td.func()()).thenReturn('lol1')
    const td2 = td.when(td.func()()).thenReturn('lol2')

    assert._isEqual(td1(), 'lol1')
    assert._isEqual(td2(), 'lol2')
  },
  'using matchers' () {
    td.when(testDouble(88, td.matchers.isA(Number))).thenReturn('yay')

    assert._isEqual(testDouble(88, 5), 'yay')
    assert._isEqual(testDouble(44, 5), undefined)
    assert._isEqual(testDouble(88, 'five'), undefined)
  },
  'using deep matchers': {
    'single level' () {
      td.when(testDouble({ key: td.matchers.isA(String) })).thenReturn('yay')

      assert._isEqual(testDouble({ key: 'testytest' }), 'yay')
      assert._isEqual(testDouble({ key: 42 }), undefined)
      assert._isEqual(testDouble({}), undefined)
      assert._isEqual(testDouble('i am a string'), undefined)
    },
    'deeply nested' () {
      td.when(testDouble({
        a: {
          b: td.matchers.isA(String)
        }
      })).thenReturn('yay')

      assert._isEqual(testDouble({
        a: {
          b: 'testytest'
        }
      }), 'yay')

      assert._isEqual(testDouble({
        a: {
          b: 42
        }
      }), undefined)

      assert._isEqual(testDouble({
        a: 'testytest'
      }), undefined)
    },
    'array values' () {
      td.when(testDouble([5, td.matchers.isA(String)])).thenReturn('yay')

      assert._isEqual(testDouble([5, 'testytest']), 'yay')
      assert._isEqual(testDouble([5, 6]), undefined)
      assert._isEqual(testDouble([5]), undefined)
      assert._isEqual(testDouble([]), undefined)
    },
    'arguments with circular structures' () {
      const arg = {
        foo: 'bar'
      }
      arg.baz = arg
      td.when(testDouble(arg)).thenReturn('yay')

      assert._isEqual(testDouble(arg), 'yay')
      assert._isEqual(testDouble('no'), undefined)
    }
  },
  'stubbing sequential returns': {
    'a single stubbing' () {
      td.when(testDouble()).thenReturn(10, 9)

      const results = [testDouble(), testDouble(), testDouble()]

      assert._isEqual(results[0], 10)
      assert._isEqual(results[1], 9)
      assert._isEqual(results[2], 9)
    },
    'two overlapping stubbings' () {
      td.when(testDouble()).thenReturn('A')

      testDouble()

      td.when(testDouble()).thenReturn('B', 'C')

      assert._isEqual(testDouble(), 'B')
    }
  },
  'stubbing actions with `thenDo` instead of `thenReturn`' () {
    let result
    td.when(testDouble(55)).thenDo((arg) => { result = 'yatta ' + arg })

    testDouble(55)

    assert._isEqual(result, 'yatta 55')
  },
  'stubbing actions with `thenDo` preserves function context' () {
    td.when(testDouble(55)).thenDo(function () {
      return this.answer
    })

    const result = testDouble.call({
      answer: 'yatta'
    }, 55)

    assert._isEqual(result, 'yatta')
  },
  'stubbing actions with `thenThrow` instead of `thenReturn`' () {
    const error = new Error('lol')
    td.when(testDouble(42)).thenThrow(error)

    try {
      testDouble(42)
      assert.fail('should have errored!')
    } catch (e) {
      assert._isEqual(e, error)
    }
  },
  'stubbing promises': {
    'with a native promise': {
      'td.when…thenResolve' (done) {
        td.when(testDouble(10)).thenResolve('pants')
        testDouble(10).then((resolved) => {
          assert._isEqual(resolved, 'pants')
          done()
        })
      },
      'thenResolve with multiple values' (done) {
        td.when(testDouble(5)).thenResolve('shirts', 'ties')

        testDouble(5).then((resolvedFirst) => {
          testDouble(5).then((resolvedSecond) => {
            assert._isEqual(resolvedFirst, 'shirts')
            assert._isEqual(resolvedSecond, 'ties')
            done()
          })
        })
      },
      'td.when…thenReject' (done) {
        td.when(testDouble(10)).thenReject('oops')

        testDouble(10).then(null, (rejected) => {
          assert._isEqual(rejected, 'oops')
          done()
        })
      },
      'thenResolve with multiple values again' (done) {
        td.when(testDouble(5)).thenReject('darn', 'dang')
        testDouble(5).then(null, (rejectedFirst) => {
          testDouble(5).then(null, (rejectedSecond) => {
            assert._isEqual(rejectedFirst, 'darn')
            assert._isEqual(rejectedSecond, 'dang')
            done()
          })
        })
      }
    },
    'with an alternative promise constructor': {
      beforeEach () {
        class FakePromise {
          constructor (executor) {
            executor(
              (resolved) => { this.resolved = resolved },
              (rejected) => { this.rejected = rejected }
            )
          }

          then (success, failure) {
            if (this.resolved) {
              success(this.resolved + '!')
            } else {
              failure(this.rejected + '?')
            }
          }
        }
        td.config({ promiseConstructor: FakePromise })
      },
      'td.when…thenResolve' (done) {
        td.when(testDouble(10)).thenResolve('pants')
        testDouble(10).then((resolved) => {
          assert._isEqual(resolved, 'pants!')
          done()
        })
      },
      'td.when…thenReject' (done) {
        td.when(testDouble(10)).thenReject('oops')
        testDouble(10).then(null, (rejected) => {
          assert._isEqual(rejected, 'oops?')
          done()
        })
      }
    },
    'with no promise constructor' () {
      const warnings = []
      const errors = []
      console.warn = (m) => { warnings.push(m) }
      console.error = (m) => { errors.push(m) }
      td.config({ promiseConstructor: undefined })

      td.when(testDouble(10)).thenResolve('pants')

      assert._isEqual(warnings[0], "Warning: testdouble.js - td.when - no promise constructor is set, so this `thenResolve` or `thenReject` stubbing\nwill fail if it's satisfied by an invocation on the test double. You can tell\ntestdouble.js which promise constructor to use with `td.config`, like so:\n\n  td.config({\n    promiseConstructor: require('bluebird')\n  })")

      // phase 2: actually invoking it
      try {
        testDouble(10)
        assert.fail('should have errored')
      } catch (e) {
        assert._isEqual(e.message, "Error: testdouble.js - td.when - no promise constructor is set (perhaps this runtime lacks a native Promise\nfunction?), which means this stubbing can't return a promise to your\nsubject under test, resulting in this error. To resolve the issue, set\na promise constructor with `td.config`, like this:\n\n  td.config({\n    promiseConstructor: require('bluebird')\n  })")
      }
    }
  },
  'stubbing error, no invocation found' () {
    td.reset()

    try {
      td.when().thenReturn('hi')
      assert.fail('should have errored')
    } catch (e) {
      assert._isEqual(e.message, "Error: testdouble.js - td.when - No test double invocation call detected for `when()`.\n\n  Usage:\n    when(myTestDouble('foo')).thenReturn('bar')")
    }
  },
  'config object': {
    'ignoring extra arguments': {
      'for a no-arg stubbing' () {
        td.when(testDouble(), {
          ignoreExtraArgs: true
        }).thenReturn('pewpew')

        result = testDouble('so', 'many', 'args')

        assert._isEqual(result, 'pewpew')
      },
      'when an initial-arg-matters' () {
        td.when(testDouble('important'), {
          ignoreExtraArgs: true
        }).thenReturn('neat')

        assert._isEqual(testDouble('important'), 'neat')
        assert._isEqual(testDouble('important', 'not important'), 'neat')
        assert._isEqual(testDouble(), undefined)
        assert._isEqual(testDouble('unimportant', 'not important'), undefined)
      }
    },
    'limiting times stubbing will work': {
      'a single stub' () {
        td.when(testDouble(), { times: 2 }).thenReturn('pants')

        result = [testDouble(), testDouble(), testDouble()]

        assert._isEqual(result, ['pants', 'pants', undefined])
      },
      'two overlapping stubbings' () {
        td.when(testDouble()).thenReturn('NO')
        td.when(testDouble(), { times: 1 }).thenReturn('YES')

        result = [testDouble(), testDouble(), testDouble()]

        assert._isEqual(result, ['YES', 'NO', 'NO'])
      }
    }
  },
  'nested whens' () {
    const knob = td.func()
    const door = td.func()
    td.when(knob('twist')).thenReturn({
      door: td.when(door('push')).thenReturn('open')
    })

    result = knob('twist').door('push')

    assert._isEqual(result, 'open')
  },
  'support cloneArgs option' () {
    const person = { age: 19 }
    td.when(testDouble(person), { cloneArgs: false }).thenReturn('no-clone')
    td.when(testDouble(person), { cloneArgs: true }).thenReturn('clone')

    person.age = 20

    assert._isEqual(testDouble({ age: 19 }), 'clone')
    assert._isEqual(testDouble({ age: 20 }), 'no-clone')
  }
}
