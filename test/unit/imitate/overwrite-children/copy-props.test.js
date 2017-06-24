import _ from 'lodash'

import subject from '../../../../src/imitate/overwrite-children/copy-props'

module.exports = {
  'copies basic props retaining existing': () => {
    const thing = {}
    const target = {d: 5}

    subject(target, {
      a: basicPropDescriptorFor(1),
      b: basicPropDescriptorFor('foo'),
      c: basicPropDescriptorFor(thing)
    })

    assert.equal(target.a, 1)
    assert.equal(target.b, 'foo')
    assert.equal(target.c, thing)
    assert.equal(target.d, 5)
  },
  'overwrites only writable and configurable existing props': () => {
    const target = Object.defineProperties({}, {
      a: basicPropDescriptorFor(4),
      b: basicPropDescriptorFor(5, {writable: false}),
      c: basicPropDescriptorFor(6, {configurable: false})
    })

    subject(target, {
      a: basicPropDescriptorFor(1),
      b: basicPropDescriptorFor(2),
      c: basicPropDescriptorFor(3)
    })

    assert.equal(target.a, 1)
    assert.equal(target.b, 5)
    assert.equal(target.c, 6)
  },
  'if the non-configurable prop is named prototype, copy that too': () => {
    const target = Object.defineProperties({}, {
      prototype: basicPropDescriptorFor({}, {
        configurable: false
      })
    })
    const fakePrototype = {}

    subject(target, {
      prototype: basicPropDescriptorFor(fakePrototype)
    })

    assert.equal(target.prototype, fakePrototype)
  },
  'copies non-enumerable props and leaves them non-enumerable': () => {
    const target = {}

    subject(target, {
      lol: basicPropDescriptorFor(42, {enumerable: false})
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
    const target = {}

    subject(target, {
      a: basicPropDescriptorFor(42, {enumerable: true}),
      b: basicPropDescriptorFor(foo, {enumerable: true})
    })

    assert.equal(target.a, 42)
    assert.strictEqual(Object.getOwnPropertyDescriptor(target, 'a').enumerable, true)
    assert.equal(target.b, foo)
    assert.strictEqual(Object.getOwnPropertyDescriptor(target, 'b').enumerable, true)
  },
  'only copies props passed to it': () => {
    const target = {d: 4}

    subject(target, {
      a: basicPropDescriptorFor(1),
      c: basicPropDescriptorFor(3),
      e: basicPropDescriptorFor(5)
    })

    assert.equal(target.a, 1)
    assert.ok(!('b' in target))
    assert.equal(target.c, 3)
    assert.equal(target.d, 4)
    assert.equal(target.e, 5)
  },
  'provides visitor function parameter for altering values': () => {
    const target = {}

    subject(target, {
      a: basicPropDescriptorFor(1),
      b: basicPropDescriptorFor(2),
      c: basicPropDescriptorFor(3)
    }, (name, value) => `${name}: ${value + 10}`)

    assert.deepEqual(target, {
      a: 'a: 11',
      b: 'b: 12',
      c: 'c: 13'
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
