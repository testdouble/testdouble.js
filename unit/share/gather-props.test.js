import _ from '../../src/wrap/lodash'
import subject from '../../src/share/gather-props'

module.exports = {
  'on a plain object bag': () => {
    const thing = {
      foo: function () {},
      bar: 42
    }

    const result = subject(thing)

    assert.deepEqual(result, ['foo', 'bar'])
  },
  'on a function': () => {
    const thing = () => {}
    thing.foo = () => {}
    thing.bar = 42

    const result = subject(thing)

    assert.deepEqual(result, ['length', 'name', 'prototype', 'foo', 'bar'])
  },
  'statics on a class': () => {
    class Thing {
      static foo () {}
    }
    Thing.bar = 42

    const result = subject(Thing)

    assert.deepEqual(result, ['length', 'name', 'prototype', 'foo', 'bar'])
  },
  'instance props on a class': () => {
    class Thing {
      constructor () {
        this.foo = 42
      }
      bar () {}
    }

    const result = subject(new Thing())

    assert.deepEqual(result, ['foo', 'bar'])
  },
  'instance of an extended class': () => {
    class Thing1 {
      bar () {}
    }
    class Thing2 extends Thing1 {
      foo () {}
    }

    const result = subject(new Thing2())

    assert.deepEqual(result, ['foo', 'bar'])
  },
  'on an object created with Object.create': () => {
    const thing = Object.create({
      foo: function () {},
      bar: 42
    })

    const result = subject(thing)

    assert.deepEqual(result, ['foo', 'bar'])
  },
  'even get non-enumerable props': () => {
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

    assert.deepEqual(result, ['foo', 'bar'])
  },
  'extending a native type': () => {
    const Thing = function () {}
    Thing.prototype = Object.create(Map.prototype)
    Thing.prototype.constructor = Thing

    const result = subject(new Thing())

    assert.ok(_.includes(result, 'set'))
    assert.ok(_.includes(result, 'get'))
    assert.ok(_.includes(result, 'entries'))
  }
}
