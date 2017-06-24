import subject from '../../../../src/imitate/overwrite-children/is-primitive-like'

module.exports = {
  'identifies primitive things': () => {
    assert.equal(subject(), true)
    assert.equal(subject(false), true)
    assert.equal(subject(true), true)
    assert.equal(subject(undefined), true)
    assert.equal(subject(null), true)
    assert.equal(subject(1), true)
    assert.equal(subject('hi'), true)
    assert.equal(subject(NaN), true)
  },
  'identifies symbols': () => {
    if (!global.Symbol) return

    assert.equal(subject(Symbol.species), true)
  },
  'identifies boxed types and basic value types': () => {
    assert.equal(subject(new String('hi')), true) // eslint-disable-line
    assert.equal(subject(new Boolean(true)), true)  // eslint-disable-line
    assert.equal(subject(new Number(0)), true)  // eslint-disable-line
    assert.equal(subject(/hi/), true)
    assert.equal(subject(new Date()), true)
  },
  'gives functions, arrays, and custom objects a pass': () => {
    assert.equal(subject(new Object()), false) // eslint-disable-line
    assert.equal(subject(function () {}), false)
    assert.equal(subject([]), false)
    assert.equal(subject({}), false)
  }
}
