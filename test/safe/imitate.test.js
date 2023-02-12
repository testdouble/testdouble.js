module.exports = {
  'strict _isEqual stuff (not objects typically)' () {
    [
      [null, null],
      [undefined, undefined],
      [true, true],
      [false, false],
      [0, 0],
      [1, 1],
      ['', ''],
      ['lol', 'lol'],
      [Symbol.species, Symbol.species]
    ].forEach(entry => {
      const [original, expected] = entry

      assert._isEqual(td.imitate(original), expected)
    })
    assert._isEqual(isNaN(td.imitate(NaN)), true)
  },
  'deep _isEqual but not strict equal stuff' () {
    [
      [new Boolean(true), new Boolean(true)], // eslint-disable-line
      [new Number(8), new Number(8)], // eslint-disable-line
      [new String('pants'), new String('pants')], // eslint-disable-line
      [new Date(38), new Date(38)],
      [/foo/, /foo/],
      [[1, 2, 3], [1, 2, 3]],
      [(function () { return arguments })(4, 5, 6), [4, 5, 6]]
    ].forEach(entry => {
      const [original, expected] = entry

      assert.deepEqual(td.imitate(original), expected)
      assert.notStrictEqual(td.imitate(original), expected)
    })

    // errors are a special case, but what we care most about is the message:
    assert._isEqual(td.imitate(new Error('foo')).message, 'foo')
  },
  'skips encountered objects' () {
    const foo = { a: 1, b: 2 }
    const bar = { c: 3, foo }
    foo.bar = bar
    const original = { item: foo }

    const result = td.imitate(original)

    assert._isEqual(result, original)
    assert._isEqual(result, {
      item: {
        a: 1,
        b: 2,
        bar: {
          c: 3,
          foo // <- and so on
        }
      }
    })
    assert._isNotEqual(result.item, foo)
    assert._isNotEqual(result.item.bar, bar)

    // Make sure the cycles are broken with the exact same clone reference
    assert._isEqual(result.item, result.item.bar.foo)
    assert._isEqual(result.item.bar, result.item.bar.foo.bar)
  },
  'ensure we do NOT invoke custom user constructors bc side effects' () {
    let calls = 0
    class Thing {
      constructor () {
        calls++
      }
    }
    const thing = new Thing()
    const original = { item: thing }

    const result = td.imitate(original)

    assert._isEqual(result.item instanceof Thing, true)
    assert._isNotEqual(result.item, thing)
    assert._isEqual(calls, 1)
  },
  'any functions are converted to test doubles with prefixed names' () {
    const original = function pants () {}
    original.shirt = function () {}
    original.shirt.tie = function () {}

    const result = td.imitate(original)

    assert._isEqual(td.explain(result).name, 'pants')
    assert._isEqual(td.explain(result.shirt).name, 'pants.shirt')
    assert._isEqual(td.explain(result.shirt.tie).name, 'pants.shirt.tie')
  },
  'skips over generator functions, even their custom properties' () {
    // This is currently unsupported, expect to kill this test someday
    if (!ES_SUPPORT.GENERATORS) return
    const original = {
      func: eval('(function* () {})') // eslint-disable-line
    }
    const otherRef = {}
    original.func.customProp = otherRef

    const result = td.imitate(original)

    assert._isEqual(result.func, original.func)
    assert._isEqual(result.func.customProp, otherRef) // e.g. NOT cloned
  },
  'naming stuff': {
    'prototypal things' () {
      class Thing {
        doStuff () {}
      }
      Thing.prototype.doStuff.bar = { baz: function () {} }

      const result = td.imitate(Thing)

      assert._isEqual(td.explain(result).name, 'Thing')
      assert._isEqual(td.explain(result.prototype.doStuff).name,
        'Thing.prototype.doStuff')
      assert._isEqual(td.explain(result.prototype.doStuff.bar.baz).name,
        'Thing.prototype.doStuff.bar.baz')
    },
    'array things' () {
      const original = {
        items: [
          function () {},
          function withName () {},
          () => false,
          {
            biz: function () {}
          }
        ]
      }

      const result = td.imitate(original)

      assert._isEqual(td.explain(result.items[0]).name, '.items[0]')
      assert._isEqual(td.explain(result.items[1]).name, '.items[1]')
      assert._isEqual(td.explain(result.items[2]).name, '.items[2]')
      assert._isEqual(td.explain(result.items[3].biz).name, '.items[3].biz')
    },
    'other top level things' () {
      assert._isEqual(td.explain(td.imitate([() => 1])[0]).name, '[0]')
      const foo = (function () { return function () {} })()
      foo.bar = function () {}
      assert._isEqual(td.explain(td.imitate(foo)).name, '(anonymous function)')
      assert._isEqual(td.explain(td.imitate(foo).bar).name, '.bar')
    }
  }
}
