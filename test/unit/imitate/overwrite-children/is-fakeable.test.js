import subject from '../../../../src/imitate/overwrite-children/is-fakeable'

module.exports = {
  'identifies primitive things': () => {
    assert.equal(subject(), false)
    assert.equal(subject(true), false)
    assert.equal(subject(false), false)
    assert.equal(subject(undefined), false)
    assert.equal(subject(null), false)
    assert.equal(subject(1), false)
    assert.equal(subject('hi'), false)
    assert.equal(subject(NaN), false)
  },
  'identifies symbols': () => {
    if (!global.Symbol) return

    assert.equal(subject(Symbol.species), false)
  },
  'identifies boxed types and basic value types': () => {
    assert.equal(subject(new String('hi')), false) // eslint-disable-line
    assert.equal(subject(new Boolean(false)), false)  // eslint-disable-line
    assert.equal(subject(new Number(0)), false)  // eslint-disable-line
    assert.equal(subject(/hi/), false)
    assert.equal(subject(new Date()), false)
  },
  'gives functions, arrays, and custom objects a pass': () => {
    assert.equal(subject(new Object()), true) // eslint-disable-line
    assert.equal(subject(function () {}), true)
    assert.equal(subject([]), true)
    assert.equal(subject({}), true)
  },
  'generators are not fakeable': () => {
    if (!ES_SUPPORT.GENERATORS) return
    assert.equal(subject(eval('(function* (){})')), false) // eslint-disable-line
  }
}
