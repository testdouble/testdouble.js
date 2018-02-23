import argsMatch from '../../src/args-match'

const matches = (expected, actual) =>
  argsMatch([expected], [actual], {})

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

      assert._isEqual(matches(matcher, 5), true)
      assert._isEqual(matches(matcher, new Number(5)), true) // eslint-disable-line
      assert._isEqual(matches(matcher, Number(5)), true)
      assert._isEqual(matches(matcher, Number('foo')), true)
      assert._isEqual(matches(matcher, 'foo'), false)
    },
    'strings' () {
      matcher = td.matchers.isA(String)

      assert._isEqual(matches(matcher, 5), false)
      assert._isEqual(matches(matcher, 'plop'), true)
      assert._isEqual(matches(matcher, String('plop')), true)
      assert._isEqual(matches(matcher, new String('plop')), true) // eslint-disable-line
    },
    'booleans' () {
      matcher = td.matchers.isA(Boolean)
      assert._isEqual(matches(matcher, false), true)
      assert._isEqual(matches(matcher, true), true)
      assert._isEqual(matches(matcher, Boolean(false)), true)
      assert._isEqual(matches(matcher, new Boolean(false)), true)  // eslint-disable-line
      assert._isEqual(matches(matcher, 'false'), false)
      assert._isEqual(matches(matcher, void 0), false)
    },
    'other junk' () {
      assert._isEqual(matches(td.matchers.isA(Array), []), true)
      assert._isEqual(matches(td.matchers.isA(Object), []), true)
      assert._isEqual(matches(td.matchers.isA(Date), new Date()), true)
      assert._isEqual(matches(td.matchers.isA(Date), new Object()), false)  // eslint-disable-line
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
    assert._isEqual(matches(td.matchers.anything(), null), true)
    assert._isEqual(matches(td.matchers.anything(), void 0), true)
    assert._isEqual(matches(td.matchers.anything(), new Date()), true)
    assert._isEqual(matches(td.matchers.anything(), {
      a: 'foo',
      b: 'bar'
    }), true)
  },
  '.contains': {
    'strings' () {
      assert._isEqual(matches(td.matchers.contains('bar'), 'foobarbaz'), true)
      assert._isEqual(matches(td.matchers.contains('biz'), 'foobarbaz'), false)
    },
    'arrays' () {
      assert._isEqual(matches(td.matchers.contains('a'), ['a', 'b', 'c']), true)
      assert._isEqual(matches(td.matchers.contains('a', 'c'), ['a', 'b', 'c']), true)
      assert._isEqual(matches(td.matchers.contains(['a', 'c']), ['a', 'b', 'c']), false)
      assert._isEqual(matches(td.matchers.contains(['a', 'c']), [1, ['a', 'c'], 4]), true)
      assert._isEqual(matches(td.matchers.contains(['a', 'c']), ['a', 'b', 'z']), false)
      assert._isEqual(matches(td.matchers.contains(true, 5, null, void 0), [true, 5, void 0, null]), true)
      assert._isEqual(matches(td.matchers.contains(true, 5, null, void 0), [true, 5, null]), false)
      assert._isEqual(matches(td.matchers.contains('b', td.matchers.isA(Number)), ['a', 3, 'b']), true)
    },
    'objects' () {
      assert._isEqual(matches(td.matchers.contains({
        foo: 'bar',
        baz: 42
      }), {
        foo: 'bar',
        baz: 42,
        stuff: this
      }), true)

      assert._isEqual(matches(td.matchers.contains({
        foo: 'bar',
        lol: 42
      }), {
        foo: 'bar',
        baz: 42
      }), false)

      assert._isEqual(matches(td.matchers.contains({
        lol: {
          deep: [4, 2]
        }
      }), {
        lol: {
          deep: [4, 2],
          other: 'stuff'
        }
      }), true)

      assert._isEqual(matches(td.matchers.contains({
        deep: {
          thing: 'stuff'
        }
      }), {}), false)

      assert._isEqual(matches(td.matchers.contains({
        deep: {
          thing: 'stuff'
        }
      }), {
        deep: {
          thing: 'stuff',
          shallow: 5
        }
      }), true)

      assert._isEqual(matches(td.matchers.contains({
        container: {
          size: 'S'
        }
      }), {
        ingredient: 'beans',
        container: {
          type: 'cup',
          size: 'S'
        }
      }), true)
    },
    'objects containing matchers' () {
      assert._isEqual(matches(td.matchers.contains(td.matchers.isA(Number)), {
        a: 'foo',
        b: 32
      }), true)

      assert._isEqual(matches(td.matchers.contains(td.matchers.isA(Function)), {
        a: 'foo',
        b: 32
      }), false)

      assert._isEqual(matches(td.matchers.contains({
        a: td.matchers.contains(1, 2)
      }), {
        a: [4, 1, 2, 3]
      }), true)

      assert._isEqual(matches(td.matchers.contains({
        a: td.matchers.contains(1, 5)
      }), {
        a: [4, 1, 2, 3]
      }), false)

      assert._isEqual(matches(td.matchers.contains({
        someString: td.matchers.isA(String)
      }), {
        someString: 'beautifulString'
      }), true)

      assert._isEqual(matches(td.matchers.contains({
        someString: td.matchers.isA(String)
      }), {
        someString: 'beautifulString',
        irrelevant: true
      }), true)

      assert._isEqual(matches(td.matchers.contains({
        nested: {
          someString: td.matchers.isA(String)
        },
        relevant: true
      }), {
        nested: {
          someString: 'beautifulString'
        },
        relevant: true
      }), true)

      assert._isEqual(matches(td.matchers.contains({
        someString: td.matchers.isA(String)
      }), {
        someString: 4
      }), false)

      assert._isEqual(matches(td.matchers.contains({
        nested: td.matchers.contains({
          nestedString: td.matchers.isA(String)
        })
      }), {
        nested: {
          nestedString: 'abc',
          irrelevant: true
        },
        irrelevantHere: 'alsoTrue'
      }), true)

      assert._isEqual(matches(td.matchers.contains({
        nested: td.matchers.contains({
          nestedString: td.matchers.isA(Number)
        })
      }), {
        nested: {
          nestedString: 'abc',
          irrelevant: true
        },
        irrelevantHere: 'not a number!'
      }), false)

      assert._isEqual(matches(td.matchers.contains({
        a: [td.matchers.isA(Number)]
      }), {
        a: [5]
      }), true)
    },
    'regexp' () {
      assert._isEqual(matches(td.matchers.contains(/abc/), 'abc'), true)
      assert._isEqual(matches(td.matchers.contains(/abc/), {
        foo: 'bar'
      }), false)
      assert._isEqual(matches(td.matchers.contains(/abc/), ['foo', 'bar']), false)
    },
    'nonsense' () {
      assert._isEqual(matches(td.matchers.contains(42), 42), false)
      assert._isEqual(matches(td.matchers.contains(null), 'shoo'), false)
      assert._isEqual(matches(td.matchers.contains(), 'shoo'), false)
      assert._isEqual(matches(td.matchers.contains({}), void 0), false)
    }
  },
  'argThat' () {
    assert._isEqual(matches(td.matchers.argThat(function (arg) {
      return arg > 5
    }), 6), true)

    assert._isEqual(matches(td.matchers.argThat(function (arg) {
      return arg > 5
    }), 5), false)
  },
  'not' () {
    assert._isEqual(matches(td.matchers.not(5), 6), true)
    assert._isEqual(matches(td.matchers.not(5), 5), false)
    assert._isEqual(matches(td.matchers.not(['hi']), ['hi']), false)
  }
}
