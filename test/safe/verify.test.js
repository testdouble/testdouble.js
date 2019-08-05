function shouldFail (fn, message) {
  try {
    fn()
    assert.fail('expected to have failed, but did not')
  } catch (e) {
    if (message) {
      assert._isEqual(e.message, message)
    }
  }
}

const ogWarn = console.warn
let testDouble, warnings
module.exports = {
  beforeEach () {
    testDouble = td.func()
  },
  'a satisfied verification' () {
    testDouble('dogs', 'cats')

    td.verify(testDouble('dogs', 'cats'))
  },
  'an unsatisfied verification - no interactions' () {
    const arg = {
      joe: 5,
      jill: [1, '2', 3]
    }
    arg.circ = arg

    shouldFail(() => {
      td.verify(testDouble('WOAH', arg))
    }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `("WOAH", {joe: 5, jill: [1, "2", 3], circ: "[Circular]"})`.\n\n  But there were no invocations of the test double.')
  },
  'unsatisfied verify - other interactions' () {
    testDouble('the wrong WOAH')

    shouldFail(() => {
      td.verify(testDouble('WOAH'))
    }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `("WOAH")`.\n\n  All calls of the test double, in order were:\n    - called with `("the wrong WOAH")`.')
  },
  'unsatisfied verify - wrong double object' () {
    testDouble(td.object('the wrong double object!'))

    shouldFail(() => {
      td.verify(testDouble(td.object('double object')))
    }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `([test double object for \"double object\"])`.\n\n  All calls of the test double, in order were:\n    - called with `([test double object for \"the wrong double object!\"])`.')
  },
  'unsatisfied verify - wrong arg count' () {
    testDouble('good', 'bad')

    shouldFail(() => {
      td.verify(testDouble('good'))
    }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `("good")`.\n\n  All calls of the test double, in order were:\n    - called with `("good", "bad")`.')
  },
  'unsatisfied verify - wrong arg count with ignored args' () {
    testDouble('good', 'bad', 'more', 'args')

    shouldFail(() => {
      td.verify(testDouble('good', 'gooder'), {
        ignoreExtraArgs: true
      })
    }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `("good", "gooder")`, ignoring any additional arguments.\n\n  All calls of the test double, in order were:\n    - called with `("good", "bad", "more", "args")`.')
  },
  'with a named double' () {
    testDouble = td.func('#footime')

    assert.throws(() => {
      td.verify(testDouble())
    }, /verification on test double `#footime`/)
  },
  'with a prototype-modeling double' () {
    const SomeType = function Foo () {}
    SomeType.prototype.bar = function () {}
    SomeType.prototype.baz = function () {}
    SomeType.prototype.biz = 'not a function!'
    const testDoubleObj = td.constructor(SomeType)

    assert.throws(() => {
      td.verify(testDoubleObj.prototype.baz())
    }, /verification on test double `Foo.prototype.baz`/)
    assert._isEqual(testDoubleObj.prototype.biz, 'not a function!')
  },
  'with a test double *as an arg* to another': {
    'with an unnamed double function _as an arg_' () {
      testDouble = td.func()
      const someTestDoubleArg = td.func()

      assert.throws(() => {
        td.verify(testDouble(someTestDoubleArg))
      }, /called with `\(\[test double \(unnamed\)\]\)`/)
    },
    'with a named double function _as an arg_' () {
      testDouble = td.func()
      const someTestDoubleArg = td.func('#foo')

      assert.throws(() => {
        td.verify(testDouble(someTestDoubleArg))
      }, /called with `\(\[test double for "#foo"\]\)`/)
    },
    'with an unnamed double object _as an arg_' () {
      testDouble = td.func()
      const someTestDoubleArg = td.object()

      assert.throws(() => {
        td.verify(testDouble(someTestDoubleArg))
      }, /called with `\(\[test double object\]\)`/)
    },
    'with a named double object _as an arg_' () {
      testDouble = td.func()
      const someTestDoubleArg = td.object('bar')

      assert.throws(() => {
        td.verify(testDouble(someTestDoubleArg))
      }, /called with `\(\[test double object for "bar"\]\)`/)
    }
  },
  'a double-free verification error' () {
    shouldFail(() => {
      td.verify()
    }, "Error: testdouble.js - td.verify - No test double invocation detected for `verify()`.\n\n  Usage:\n    verify(myTestDouble('foo'))")
  },
  'using matchers': {
    beforeEach () {
      testDouble(55)
    },
    'satisfied does not throw' () {
      td.verify(testDouble(td.matchers.isA(Number)))
    },
    'unsatisfied' () {
      shouldFail(() => {
        td.verify(testDouble(td.matchers.isA(String)))
      }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `(isA(String))`.\n\n  All calls of the test double, in order were:\n    - called with `(55)`.')
    }
  },
  'using deep matchers': {
    'single level': {
      beforeEach () {
        testDouble({ value: 55 })
      },
      'satisfied' () {
        td.verify(testDouble({
          value: td.matchers.isA(Number)
        }))
      },
      'unsatisfied' () {
        shouldFail(() => {
          td.verify(testDouble({
            value: td.matchers.isA(String)
          }))
        }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `({value: isA(String)})`.\n\n  All calls of the test double, in order were:\n    - called with `({value: 55})`.')
      }
    },
    'deeply nested': {
      beforeEach () {
        testDouble({
          value: {
            value: 55
          }
        })
      },
      'satisfied' () {
        td.verify(testDouble({
          value: {
            value: td.matchers.isA(Number)
          }
        }))
      },
      'unsatisfied' () {
        shouldFail(() => {
          td.verify(testDouble({
            value: {
              value: td.matchers.isA(String)
            }
          }))
        }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `({value: {value: isA(String)}})`.\n\n  All calls of the test double, in order were:\n    - called with `({value: {value: 55}})`.')
      }
    },
    'array values': {
      beforeEach () {
        testDouble([55])
      },
      'satisfied' () {
        td.verify(testDouble([td.matchers.isA(Number)]))
      },
      'unsatisfied' () {
        shouldFail(() => {
          td.verify(testDouble([td.matchers.isA(String)]))
        }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `([isA(String)])`.\n\n  All calls of the test double, in order were:\n    - called with `([55])`.')
      }
    }
  },
  configuration: {
    'ignoring extra arguments (more thoroughly tested via when())' () {
      testDouble('matters', 'not')

      td.verify(testDouble('matters'), {
        ignoreExtraArgs: true
      })
    },
    'number of times an invocation is satisfied': {
      '0 times, satisfied' () {
        td.verify(testDouble(), {
          times: 0
        })
      },
      '0 times, unsatisfied' () {
        testDouble()
        shouldFail(() => {
          td.verify(testDouble(), {
            times: 0
          })
        }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `()` 0 times.\n\n  All calls of the test double, in order were:\n    - called with `()`.')
      },
      '1 time, satisfied' () {
        testDouble()

        td.verify(testDouble(), {
          times: 1
        })
      },
      '1 time, unsatisfied (with 2)' () {
        testDouble()
        testDouble()

        shouldFail(() => {
          td.verify(testDouble(), {
            times: 1
          })
        }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `()` 1 time.\n\n  All calls of the test double, in order were:\n    - called with `()`.\n    - called with `()`.')
      },
      '4 times, satisfied' () {
        testDouble()
        testDouble()
        testDouble()
        testDouble()

        td.verify(testDouble(), {
          times: 4
        })
      },
      '4 times, unsatisfied (with 3)' () {
        testDouble()
        testDouble()
        testDouble()

        shouldFail(() => {
          td.verify(testDouble(), {
            times: 4
          })
        }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `()` 4 times.\n\n  3 calls that satisfied this verification:\n    - called 3 times with `()`.\n\n  All calls of the test double, in order were:\n    - called with `()`.\n    - called with `()`.\n    - called with `()`.')
      },
      '4 times as numbers, unsatisfied (with 3)' () {
        testDouble(1)
        testDouble(2)
        testDouble(2)
        testDouble('x')

        shouldFail(() => {
          td.verify(testDouble(td.matchers.isA(Number)), {
            times: 4
          })
        }, 'Unsatisfied verification on test double.\n\n  Wanted:\n    - called with `(isA(Number))` 4 times.\n\n  3 calls that satisfied this verification:\n    - called 1 time with `(1)`.\n    - called 2 times with `(2)`.\n\n  All calls of the test double, in order were:\n    - called with `(1)`.\n    - called with `(2)`.\n    - called with `(2)`.\n    - called with `("x")`.')
      }
    }
  },
  'warning when verifying a stubbed invocation': {
    beforeEach () {
      warnings = []
      console.warn = (msg) => { warnings.push(msg) }
      testDouble = td.func('.foo')
    },
    afterEach () {
      console.warn = ogWarn
    },
    'warn user for': {
      'an exact match in calls' () {
        td.when(testDouble(1)).thenReturn(5)
        testDouble(1)

        td.verify(testDouble(1))

        assert._isEqual(warnings[0], 'Warning: testdouble.js - td.verify - test double `.foo` was both stubbed and verified with arguments (1), which is redundant and probably unnecessary. (see: https://github.com/testdouble/testdouble.js/blob/master/docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double )')
      },
      'a match where stub ignores extra arguments' () {
        td.when(testDouble(1), {
          ignoreExtraArgs: true
        }).thenReturn()
        testDouble(1, 2, 3)

        td.verify(testDouble(1, 2, 3))

        assert._isEqual(warnings[0], 'Warning: testdouble.js - td.verify - test double `.foo` was both stubbed and verified with arguments (1, 2, 3), which is redundant and probably unnecessary. (see: https://github.com/testdouble/testdouble.js/blob/master/docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double )')
      },
      'a match where stub uses a matcher' () {
        td.when(testDouble(td.matchers.isA(Number))).thenReturn(5)
        testDouble(1)

        td.verify(testDouble(1))

        assert._isEqual(warnings[0], 'Warning: testdouble.js - td.verify - test double `.foo` was both stubbed and verified with arguments (1), which is redundant and probably unnecessary. (see: https://github.com/testdouble/testdouble.js/blob/master/docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double )')
      }
    },
    'don\'t warn user when verify doesn\'t match the stub' () {
      td.when(testDouble(1)).thenReturn()
      testDouble()

      td.verify(testDouble())

      assert._isEqual(warnings.length, 0)
    },
    'verification of a mutated value WITHOUT cloning should fail' () {
      const person = { age: 20 }
      testDouble(person)

      person.age = 21

      shouldFail(() => {
        td.verify(testDouble({ age: 20 }))
      })
    },
    'verification of a mutated value WITH clone: true should succeed' () {
      const person = { age: 20 }
      testDouble(person)

      person.age = 21

      td.verify(testDouble(person), { cloneArgs: false })
      td.verify(testDouble({ age: 20 }), { cloneArgs: true })
      shouldFail(() => {
        td.verify(testDouble(person), { cloneArgs: true })
      })
    }
  }
}
