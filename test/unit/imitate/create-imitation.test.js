let tdFunction, subject
module.exports = {
  beforeEach: () => {
    tdFunction = td.replace('../../../src/function').default
    subject = require('../../../src/imitate/create-imitation').default
  },
  'an array type': () => {
    assert.deepEqual(subject([], []), [])
  },
  'an arguments type': () => {
    let args = (function () { return arguments })()
    assert.deepEqual(subject(args, []), [])
  },
  'a function without names': () => {
    td.when(tdFunction('(anonymous function)')).thenReturn('fake thing')

    const result = subject(() => {}, [])

    assert.deepEqual(result, 'fake thing')
  },
  'a function with names': () => {
    td.when(tdFunction('AOK')).thenReturn('fake thing')

    const result = subject(() => {}, ['A', 'OK'])

    assert.deepEqual(result, 'fake thing')
  },
  'other instances': () => {
    const original = {a: 'b'}

    const result = subject(original)

    assert.deepEqual(result, original)
    assert.notStrictEqual(result, original)
  },
  'primitives': () => {
    assert.strictEqual(subject(true), true)
    assert.strictEqual(subject(5), 5)
    assert.strictEqual(subject('hi'), 'hi')
    assert.strictEqual(subject(null), null)
    assert.strictEqual(subject(undefined), undefined)
  },
  'symbols': () => {
    if (!global.Symbol) return
    assert.strictEqual(subject(Symbol.species), Symbol.species)
  }
}
