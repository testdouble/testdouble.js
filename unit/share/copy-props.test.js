import _ from 'lodash'

import subject from '../../src/share/copy-props'

module.exports = {
  'copies basic props retaining existing': () => {
    const thing = {}
    const original = {a: 1, b: 'foo', c: thing}
    const target = {d: 5}

    subject(original, target, {
      a: basicPropDescriptorFor(1),
      b: basicPropDescriptorFor('foo'),
      c: basicPropDescriptorFor(thing),
    })

    assert.equal(target.a, 1)
    assert.equal(target.b, 'foo')
    assert.equal(target.c, thing)
    assert.equal(target.d, 5)
  },
  'does not overwrite existing props': () => {
    const original = {a: 1}
    const target = {a: 2}

    subject(original, target, {
      a: basicPropDescriptorFor(1)
    })

    assert.equal(target.a, 2)
  },
  'copies non-enumerable props and leaves them non-enumerable': () => {
    const original = {}
    const lolDescriptor = basicPropDescriptorFor(42, {enumerable: false})
    Object.defineProperties(original, {
      lol: lolDescriptor
    })
    const target = {}

    subject(original, target, {
      lol: lolDescriptor
    })

    assert.equal(target.lol, 42)
    assert.deepEqual(Object.getOwnPropertyDescriptor(target, 'lol'), {
      value: 42,
      enumerable: false,
      writable: true,
      configurable: true
    })
  },
  'copies enumerable props and marks them enumerable': () => {
    const foo = () => {}
    const original = {a: 42, b: foo}
    const target = {}

    subject(original, target, {
      a: basicPropDescriptorFor(42, {enumerable: true}),
      b: basicPropDescriptorFor(foo, {enumerable: true})
    })

    assert.equal(target.a, 42)
    assert.strictEqual(Object.getOwnPropertyDescriptor(target, 'a').enumerable, true)
    assert.equal(target.b, foo)
    assert.strictEqual(Object.getOwnPropertyDescriptor(target, 'b').enumerable, true)
  },
  'does not blow up if propertyIsEnumerable has been axed': () => {
    const original = {a: 42}
    const target = {}
    original.propertyIsEnumerable = undefined

    subject(original, target, {a: basicPropDescriptorFor(42)})

    assert.equal(target.a, 42)
    assert.strictEqual(Object.getOwnPropertyDescriptor(target, 'a').enumerable, true)
  },
  'only copies props passed to it (and silently drops nonexistant ones)': () => {
    const original = {a: 1, b: 2, c: 3}
    const target = {d: 4}

    subject(original, target, {
      a: basicPropDescriptorFor(1),
      c: basicPropDescriptorFor(3),
      e: basicPropDescriptorFor(5)
    })

    assert.equal(target.a, 1)
    assert.ok(!('b' in target))
    assert.equal(target.c, 3)
    assert.equal(target.d, 4)
    assert.ok(!('e' in target))
  },
  'provides visitor function parameter for altering values': () => {
    const original = {
      a: 1,
      b: 2,
      c: 3
    }
    const target = {}

    subject(original, target, {
      a: basicPropDescriptorFor(1),
      b: basicPropDescriptorFor(2),
      c: basicPropDescriptorFor(3),
    }, value => value + 10)

    assert.deepEqual(target, {
      a: 11,
      b: 12,
      c: 13
    })
  }
}

const basicPropDescriptorFor = (val, except = {}) =>
  _.extend({}, {
    value: val,
    writable: true,
    configurable: true,
    enumerable: true
  }, except)
