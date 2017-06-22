import _ from 'lodash'
import subject from '../../src/imitate'

//WARNING: this is not a unit test! This is a functional test to prove out an
//         algorithm. Ideally I would have broken this up, but I really
//         struggled at first and wanted to prove it out wired up to the td@3 impl

module.exports = {
  'strict equal stuff': () => {
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
  },
  'deep equal but not strict equal stuff': () => {
    [
      [new Boolean(true), new Boolean(true)],
      [new Number(8), new Number(8)],
      [new String('pants'), new String('pants')],
      [new Date(38), new Date(38)],
      [[1,2,3], [1,2,3]],
      [(function() { return arguments })(4,5,6), [4,5,6]]
    ].forEach(entry => {
      const [original, expected] = entry

      assert.deepEqual(subject(original), expected)
      assert.notStrictEqual(subject(original), expected)
    })
  },
  'skips encountered objects': () => {
    const foo = {a: 1, b: 2}
    const bar = {c: 3, foo: foo}
    foo.bar = bar
    const original = {item: foo}

    const result = subject(original)

    assert.notStrictEqual(result, original)
    assert.deepEqual(result, {
      item: {
        a: 1,
        b: 2,
        bar: {
          c: 3,
          foo: foo //<- and so on
        }
      }
    })
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
  }

}
