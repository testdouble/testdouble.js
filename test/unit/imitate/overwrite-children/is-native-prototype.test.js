import subject from '../../../../src/imitate/overwrite-children/is-native-prototype'

module.exports = {
  'passing junk': () => {
    assert.strictEqual(subject(null), false)
    assert.strictEqual(subject(undefined), false)
  },
  'passing built-in types': () => {
    assert.strictEqual(subject('hi'), false)
    assert.strictEqual(subject(5), false)
    assert.strictEqual(subject(Object), false)
    assert.strictEqual(subject(Object.create({})), false)
    assert.strictEqual(subject({}), false)
    assert.strictEqual(subject(Function), false)
    assert.strictEqual(subject(function () {}), false)
  },
  'passing prototypes of built-in types': () => {
    assert.strictEqual(subject(('hi').prototype), false)
    assert.strictEqual(subject((5).prototype), false)
    assert.strictEqual(subject(Object.prototype), true)
    assert.strictEqual(subject(Object.create({}).prototype), false)
    assert.strictEqual(subject(({}).prototype), false)
    assert.strictEqual(subject(Function.prototype), true)
    assert.strictEqual(subject(function () {}.prototype), false)
  }
}
