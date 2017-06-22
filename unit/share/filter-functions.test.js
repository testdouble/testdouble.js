import subject from '../../src/share/filter-functions'

module.exports = {
  'if thing is null (e.g. anonymous double)': () => {
    assert.deepEqual(subject(null, []), [])
  },
  'handles basic object': () => {
    const result = subject({
      a: {value: function () {}},
      b: {value: () => true},
      c: {value: 42},
      d: {value: 'string'},
      e: {value: Object.prototype},
      f: {value: Number}
    })

    assert.deepEqual(result, ['a', 'b', 'f'])
  }
}
