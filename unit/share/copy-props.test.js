import subject from '../../src/share/copy-props'

module.exports = {
  'copies basic props retaining existing': () => {
    const thing = {}
    const original = {a: 1, b: 'foo', c: thing}
    const target = {d: 5}

    subject(original, target, ['a', 'b', 'c'])

    assert.equal(target.a, 1)
    assert.equal(target.b, 'foo')
    assert.equal(target.c, thing)
    assert.equal(target.d, 5)
  },
  'does not overwrite existing props': () => {
    const original = {a: 1}
    const target = {a: 2}

    subject(original, target, ['a'])

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

    subject(original, target, ['lol'])

    assert.equal(target.lol, 42)
    const targetPropDescriptor = Object.getOwnPropertyDescriptor(target, 'lol')
    assert.strictEqual(targetPropDescriptor.configurable, true)
    assert.strictEqual(targetPropDescriptor.writable, true)
    assert.strictEqual(targetPropDescriptor.enumerable, false)
  },
  'only copies props passed to it (and silently drops nonexistant ones)': () => {
    const original = {a: 1, b: 2, c: 3}
    const target = {d: 4}

    subject(original, target, ['a', 'c', 'e'])

    assert.equal(target.a, 1)
    assert.ok(!('b' in target))
    assert.equal(target.c, 3)
    assert.equal(target.d, 4)
    assert.ok(!('e' in target))
  }
}
