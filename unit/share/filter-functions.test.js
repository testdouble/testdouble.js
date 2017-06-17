import subject from '../../src/share/filter-functions'

module.exports = {
  'if thing is null (e.g. anonymous double)': () => {
    assert.deepEqual(subject(null, []), [])
  },
  'handles basic object': () => {
    const target = {
      a: function () {},
      b: () => true,
      c: 42,
      d: 'string',
      e: Object.prototype,
      f: Number
    }

    const result = subject(target, ['a', 'b', 'c', 'd', 'e', 'f'])

    assert.deepEqual(result, ['a', 'b', 'f'])
  },
  'handles class instance ok': () => {
    class Thing {
      e () {}
    }
    Thing.prototype.f = 42
    class SubThing extends Thing {
      a () {}
      static c () {}
    }
    SubThing.prototype.d = /hiiii/
    SubThing.prototype.b = () => true

    const result = subject(new SubThing(), ['a', 'b', 'c', 'd', 'e', 'f'])

    assert.deepEqual(result, ['a', 'b', 'e'])
  }
}
