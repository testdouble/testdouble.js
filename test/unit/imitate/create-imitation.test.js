let tdFunction, isGenerator, subject
module.exports = {
  beforeEach: () => {
    tdFunction = td.replace('../../../src/function').default
    isGenerator = td.replace('../../../src/imitate/is-generator').default
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
    const someFunc = () => {}
    td.when(tdFunction('(anonymous function)')).thenReturn('fake thing')
    td.when(isGenerator(someFunc)).thenReturn(false)

    const result = subject(someFunc, [])

    assert.deepEqual(result, 'fake thing')
  },
  'a function with names': () => {
    const someFunc = () => {}
    td.when(tdFunction('AOK')).thenReturn('fake thing')
    td.when(isGenerator(someFunc)).thenReturn(false)

    const result = subject(someFunc, ['A', 'OK'])

    assert.deepEqual(result, 'fake thing')
  },
  'other instances': () => {
    const original = {a: 'b'}

    const result = subject(original, [])

    assert.deepEqual(result, original)
    assert.notStrictEqual(result, original)
  },
  'primitives': () => {
    assert.strictEqual(subject(true, []), true)
    assert.strictEqual(subject(5, []), 5)
    assert.strictEqual(subject('hi', []), 'hi')
    assert.strictEqual(subject(null, []), null)
    assert.strictEqual(subject(undefined, []), undefined)
  },
  'symbols': () => {
    if (!global.Symbol) return
    assert.strictEqual(subject(Symbol.species, []), Symbol.species)
  },
  'generators do not blow up and just return themselves i guess': () => {
    const generator = () => {}
    td.when(tdFunction(), {ignoreExtraArgs: true}).thenReturn('fake thing')
    td.when(isGenerator(generator)).thenReturn(true)

    assert.strictEqual(subject(generator, []), generator)
  }
}
