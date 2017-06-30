import _ from 'lodash'

import explain from '../../../src/explain'
import subject from '../../../src/imitate'

module.exports = {
  'strict equal stuff (not objects typically)': () => {
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

      assert.strictEqual(subject(original), expected)
    })
    assert.ok(isNaN(subject(NaN)))
  },
  'deep equal but not strict equal stuff': () => {
    [
      [new Boolean(true), new Boolean(true)], // eslint-disable-line
      [new Number(8), new Number(8)], // eslint-disable-line
      [new String('pants'), new String('pants')], // eslint-disable-line
      [new Date(38), new Date(38)],
      [/foo/, /foo/],
      [new Error('pants'), new Error('pants')],
      [[1, 2, 3], [1, 2, 3]],
      [(function () { return arguments })(4, 5, 6), [4, 5, 6]]
    ].forEach(entry => {
      const [original, expected] = entry

      assert.deepEqual(subject(original), expected)
      assert.notStrictEqual(subject(original), expected)
    })
    assert.equal(subject(new Error('foo')).message, 'foo')
  },
  'skips encountered objects': () => {
    const foo = {a: 1, b: 2}
    const bar = {c: 3, foo: foo}
    foo.bar = bar
    const original = {item: foo}

    const result = subject(original)

    assert.notStrictEqual(result, original)
    assert.ok(_.isEqual(result, {
      item: {
        a: 1,
        b: 2,
        bar: {
          c: 3,
          foo: foo // <- and so on
        }
      }
    }))
    assert.notStrictEqual(result.item, foo)
    assert.notStrictEqual(result.item.bar, bar)

    // Make sure the cycles are broken with the exact same clone reference
    assert.strictEqual(result.item, result.item.bar.foo)
    assert.strictEqual(result.item.bar, result.item.bar.foo.bar)
  },
  'ensure we do NOT invoke custom user constructors bc side effects': () => {
    let calls = 0
    class Thing {
      constructor () {
        calls++
      }
    }
    const thing = new Thing()
    const original = { item: thing }

    const result = subject(original)

    assert.ok(result.item instanceof Thing)
    assert.notStrictEqual(result.item, thing)
    assert.equal(calls, 1)
  },
  'any functions are converted to test doubles with prefixed names': () => {
    const original = function pants () {}
    original.shirt = function () {}
    original.shirt.tie = function () {}

    const result = subject(original)

    assert.equal(explain(result).name, 'pants')
    assert.equal(explain(result.shirt).name, 'pants.shirt')
    assert.equal(explain(result.shirt.tie).name, 'pants.shirt.tie')
  },
  'skips over generator functions, even their custom properties': () => {
    // This is currently unsupported, expect to kill this test someday
    if (!ES_SUPPORT.GENERATORS) return
    const original = {
      func: eval('(function* () {})') // eslint-disable-line
    }
    const otherRef = {}
    original.func.customProp = otherRef

    const result = subject(original)

    assert.strictEqual(result.func, original.func)
    assert.strictEqual(result.func.customProp, otherRef) // e.g. NOT cloned
  },
  'naming stuff': {
    'prototypal things': () => {
      class Thing {
        doStuff () {}
      }
      Thing.prototype.doStuff.bar = { baz: function () {} }

      const result = subject(Thing)

      assert.equal(explain(result).name, 'Thing')
      assert.equal(explain(result.prototype.doStuff).name,
        'Thing.prototype.doStuff')
      assert.equal(explain(result.prototype.doStuff.bar.baz).name,
        'Thing.prototype.doStuff.bar.baz')
    },
    'array things': () => {
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

      const result = subject(original)

      assert.equal(explain(result.items[0]).name, '.items[0]')
      assert.equal(explain(result.items[1]).name, '.items[1]')
      assert.equal(explain(result.items[2]).name, '.items[2]')
      assert.equal(explain(result.items[3].biz).name, '.items[3].biz')
    },
    'other top level things': () => {
      assert.equal(explain(subject([() => 1])[0]).name, '[0]')
      const foo = (function () { return function () {} })()
      foo.bar = function () {}
      assert.equal(explain(subject(foo)).name, '(anonymous function)')
      assert.equal(explain(subject(foo).bar).name, '.bar')
    }
  }
}
