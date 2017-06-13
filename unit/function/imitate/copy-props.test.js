import subject from '../../../src/function/imitate/copy-props'

module.exports = {
  'copies basic props retaining existing': () => {
    const thing = {}
    const original = {a: 1, b: 'foo', c: thing}
    const target = {d: 5}

    subject(original, target)

    assert.equal(target.a, 1)
    assert.equal(target.b, 'foo')
    assert.equal(target.c, thing)
    assert.equal(target.d, 5)
  },
  'does not overwrite existing props': () => {
    const original = {a: 1}
    const target = {a: 2}

    subject(original, target)

    assert.equal(target.a, 2)
  },
  'copies non-enumerable props and leaves them non-enumerable': () => {
    const original = {}
    Object.defineProperties(original, {
      lol: {
        configurable: false,
        writable: false,
        value: 42,
        enumerable: false
      }
    })
    const target = {}

    subject(original, target)

    assert.equal(target.lol, 42)
    const targetPropDescriptor = Object.getOwnPropertyDescriptor(target, 'lol')
    assert.strictEqual(targetPropDescriptor.configurable, true)
    assert.strictEqual(targetPropDescriptor.writable, true)
    assert.strictEqual(targetPropDescriptor.enumerable, false)
  }
}
