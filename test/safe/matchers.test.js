import argsMatch from '../../src/args-match'

const matches = (expected, actual) =>
  assert._isEqual(argsMatch([expected], [actual], {}), true)

const doesntMatch = (expected, actual) =>
  assert._isEqual(argsMatch([expected], [actual], {}), false)

let matcher, matcherInstance
module.exports = {
  '.create': {
    beforeEach () {
      matcher = td.matchers.create({
        name: 'isSame',
        matches: (matcherArgs, actual) => {
          return matcherArgs[0] === actual
        },
        onCreate: (matcherInstance, matcherArgs) => {
          matcherInstance.__args = matcherArgs
        }
      })
    },
    'basic creation' () {
      matcherInstance = matcher('foo')

      assert._isEqual(matcherInstance.__name, 'isSame("foo")')
      assert._isEqual(matcherInstance.__matches('foo'), true)
      assert._isEqual(matcherInstance.__matches('bar'), false)
      assert._isEqual(matcherInstance.__args, ['foo'])
    },

    'name is a function' () {
      matcher = td.matchers.create({
        name (matcherArgs) {
          return 'isThing(' + matcherArgs[0].name + ')'
        },
        matches () { return true }
      })

      matcherInstance = matcher(String)

      assert._isEqual(matcherInstance.__name, 'isThing(String)')
    },

    'no name or onCreate given' () {
      matcher = td.matchers.create({
        matches () {
          return true
        }
      })

      matcherInstance = matcher('bar')

      assert._isEqual(matcherInstance.__name, '[Matcher for ("bar")]')
    }
  },
  '.isA': {
    'numbers' () {
      matcher = td.matchers.isA(Number)

      matches(matcher, 5)
      matches(matcher, new Number(5)) // eslint-disable-line
      matches(matcher, Number(5))
      matches(matcher, Number('foo'))
      doesntMatch(matcher, 'foo')
    },
    'strings' () {
      matcher = td.matchers.isA(String)

      doesntMatch(matcher, 5)
      matches(matcher, 'plop')
      matches(matcher, String('plop'))
      matches(matcher, new String('plop')) // eslint-disable-line
    },
    'booleans' () {
      matcher = td.matchers.isA(Boolean)
      matches(matcher, false)
      matches(matcher, true)
      matches(matcher, Boolean(false))
      matches(matcher, new Boolean(false))  // eslint-disable-line
      doesntMatch(matcher, 'false')
      doesntMatch(matcher, void 0)
    },
    'other junk' () {
      matches(td.matchers.isA(Array), [])
      matches(td.matchers.isA(Object), [])
      matches(td.matchers.isA(Date), new Date())
      doesntMatch(td.matchers.isA(Date), new Object())  // eslint-disable-line
    },
    'names' () {
      assert._isEqual(td.matchers.isA({
        name: 'Poo'
      }).__name, 'isA(Poo)')

      assert._isEqual(td.matchers.isA({
        nope: 'foo'
      }).__name, 'isA({nope: "foo"})')
    }
  },
  '.anything' () {
    matches(td.matchers.anything(), null)
    matches(td.matchers.anything(), void 0)
    matches(td.matchers.anything(), new Date())
    matches(td.matchers.anything(), {
      a: 'foo',
      b: 'bar'
    })
  },
  '.contains': {
    'strings' () {
      matches(td.matchers.contains('bar'), 'foobarbaz')
      doesntMatch(td.matchers.contains('biz'), 'foobarbaz')
    },
    'arrays' () {
      matches(td.matchers.contains('a'), ['a', 'b', 'c'])
      matches(td.matchers.contains('a', 'c'), ['a', 'b', 'c'])
      doesntMatch(td.matchers.contains(['a', 'c']), ['a', 'b', 'c'])
      matches(td.matchers.contains(['a', 'c']), [1, ['a', 'c'], 4])
      doesntMatch(td.matchers.contains(['a', 'c']), ['a', 'b', 'z'])
      matches(td.matchers.contains(true, 5, null, void 0), [true, 5, void 0, null])
      doesntMatch(td.matchers.contains(true, 5, null, void 0), [true, 5, null])
      matches(td.matchers.contains('b', td.matchers.isA(Number)), ['a', 3, 'b'])
    },
    'objects' () {
      matches(td.matchers.contains({
        foo: 'bar',
        baz: 42
      }), {
        foo: 'bar',
        baz: 42,
        stuff: this
      })

      doesntMatch(td.matchers.contains({
        foo: 'bar',
        lol: 42
      }), {
        foo: 'bar',
        baz: 42
      })

      matches(td.matchers.contains({
        lol: {
          deep: [4, 2]
        }
      }), {
        lol: {
          deep: [4, 2],
          other: 'stuff'
        }
      })

      doesntMatch(td.matchers.contains({
        deep: {
          thing: 'stuff'
        }
      }), {})

      matches(td.matchers.contains({
        deep: {
          thing: 'stuff'
        }
      }), {
        deep: {
          thing: 'stuff',
          shallow: 5
        }
      })

      matches(td.matchers.contains({
        container: {
          size: 'S'
        }
      }), {
        ingredient: 'beans',
        container: {
          type: 'cup',
          size: 'S'
        }
      })
    },
    'objects containing matchers' () {
      matches(td.matchers.contains(td.matchers.isA(Number)), {
        a: 'foo',
        b: 32
      })

      doesntMatch(td.matchers.contains(td.matchers.isA(Function)), {
        a: 'foo',
        b: 32
      })

      matches(td.matchers.contains({
        a: td.matchers.contains(1, 2)
      }), {
        a: [4, 1, 2, 3]
      })

      doesntMatch(td.matchers.contains({
        a: td.matchers.contains(1, 5)
      }), {
        a: [4, 1, 2, 3]
      })

      matches(td.matchers.contains({
        someString: td.matchers.isA(String)
      }), {
        someString: 'beautifulString'
      })

      matches(td.matchers.contains({
        someString: td.matchers.isA(String)
      }), {
        someString: 'beautifulString',
        irrelevant: true
      })

      matches(td.matchers.contains({
        nested: {
          someString: td.matchers.isA(String)
        },
        relevant: true
      }), {
        nested: {
          someString: 'beautifulString'
        },
        relevant: true
      })

      doesntMatch(td.matchers.contains({
        someString: td.matchers.isA(String)
      }), {
        someString: 4
      })

      matches(td.matchers.contains({
        nested: td.matchers.contains({
          nestedString: td.matchers.isA(String)
        })
      }), {
        nested: {
          nestedString: 'abc',
          irrelevant: true
        },
        irrelevantHere: 'alsoTrue'
      })

      doesntMatch(td.matchers.contains({
        nested: td.matchers.contains({
          nestedString: td.matchers.isA(Number)
        })
      }), {
        nested: {
          nestedString: 'abc',
          irrelevant: true
        },
        irrelevantHere: 'not a number!'
      })

      matches(td.matchers.contains({
        a: [td.matchers.isA(Number)]
      }), {
        a: [5]
      })
    },
    'dates' () {
      matches(td.matchers.contains(new Date('2011')), new Date('2011'))
      doesntMatch(td.matchers.contains(new Date('2011')), new Date('2012'))
    },
    'errors' () {
      matches(td.matchers.contains(new Error('eek')), new Error('eek'))
      matches(td.matchers.contains(new Error('message')), new Error('long message'))
      doesntMatch(td.matchers.contains(new Error('eek')), new Error('woah'))
    },
    'regexp' () {
      matches(td.matchers.contains(/abc/), 'abc')
      doesntMatch(td.matchers.contains(/abc/), {
        foo: 'bar'
      })
      doesntMatch(td.matchers.contains(/abc/), ['foo', 'bar'])
    },
    'nonsense' () {
      doesntMatch(td.matchers.contains(42), 42)
      doesntMatch(td.matchers.contains(null), 'shoo')
      doesntMatch(td.matchers.contains(), 'shoo')
      doesntMatch(td.matchers.contains({}), void 0)
    }
  },
  'argThat' () {
    matches(td.matchers.argThat(function (arg) {
      return arg > 5
    }), 6)

    doesntMatch(td.matchers.argThat(function (arg) {
      return arg > 5
    }), 5)
  },
  'not' () {
    matches(td.matchers.not(5), 6)
    doesntMatch(td.matchers.not(5), 5)
    doesntMatch(td.matchers.not(['hi']), ['hi'])
  }
}
