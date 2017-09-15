import _ from 'lodash'
import subject from '../../../../src/imitate/overwrite-children/gather-props'

module.exports = {
  'on a plain object bag': () => {
    const thing = {
      foo: function () {},
      bar: 42
    }

    const result = subject(thing)

    assert.deepEqual(result.foo, {
      value: thing.foo,
      writable: true,
      enumerable: true,
      configurable: true
    })
    assert.deepEqual(result.bar.value, thing.bar)
  },
  'on a function': () => {
    const thing = function someName (a, b, c) {}
    thing.foo = () => {}
    thing.bar = 42

    const result = subject(thing)

    assert.deepEqual(result.length.value, 3)
    assert.deepEqual(result.length.writable, false)
    assert.deepEqual(result.name.value, 'someName')
    assert.deepEqual(result.name.writable, false)
    assert.deepEqual(result.prototype.value, thing.prototype)
    assert.deepEqual(result.foo.value, thing.foo)
    assert.deepEqual(result.bar.value, thing.bar)
  },
  'statics on a class': () => {
    class Thing {
      static foo () {}
    }
    Thing.bar = 42

    const result = subject(Thing)

    assert.deepEqual(_.keys(result), ['length', 'name', 'prototype', 'foo', 'bar'])
  },
  'instance props on a class': () => {
    class Thing {
      constructor () {
        this.foo = 42
      }
      bar () {}
    }

    const result = subject(new Thing())

    assert.deepEqual(_.keys(result), ['foo', 'bar'])
    assert.deepEqual(result.foo, {
      value: 42,
      enumerable: true,
      writable: true,
      configurable: true
    })
    assert.deepEqual(result.bar, {
      value: Thing.prototype.bar,
      enumerable: false,
      writable: true,
      configurable: true
    })
  },
  'instance of an extended class': () => {
    class Thing1 {
      bar () {}
    }
    class Thing2 extends Thing1 {
      foo () {}
    }

    const result = subject(new Thing2())

    assert.deepEqual(_.keys(result), ['foo', 'bar'])
  },
  'on an object created with Object.create': () => {
    const thing = Object.create({
      foo: function () {},
      bar: 42
    })

    const result = subject(thing)

    assert.deepEqual(_.keys(result), ['foo', 'bar'])
  },
  'even get explicitly non-enumerable props': () => {
    const thing = {}
    Object.defineProperties(thing, {
      foo: {
        value: function () {},
        enumerable: false
      },
      bar: {
        value: 42,
        enumerable: false
      }
    })

    const result = subject(thing)

    assert.deepEqual(_.keys(result), ['foo', 'bar'])
  },
  'is primitive-y': () => {
    assert.deepEqual(subject(null), {})
    assert.deepEqual(subject(undefined), {})
    assert.deepEqual(subject(false), {})
    assert.deepEqual(subject(true), {})
    assert.deepEqual(subject(5), {})
  },
  'extending a native type': () => {
    const Thing = function () {}
    Thing.prototype = Object.create(Map.prototype)
    Thing.prototype.constructor = Thing
    Thing.prototype.entries = function () { /* Overwrite! */ }

    const result = subject(new Thing())

    assert.deepEqual(result.set, {
      value: Map.prototype.set,
      configurable: true,
      writable: true,
      enumerable: false
    })
    assert.deepEqual(result.entries, {
      value: Thing.prototype.entries,
      configurable: true,
      writable: true,
      enumerable: true
    })
  }
}
