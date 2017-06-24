import subject from '../../../../src/imitate/overwrite-children/chain-prototype'

module.exports = {
  'name is not prototype': () => {
    assert.equal(subject(null, null, 'stereotype', null, 'TV'), 'TV')
  },
  'original is not a function': () => {
    assert.equal(subject('lolnope', null, 'prototype', null, 'TV'), 'TV')
  },
  'sets __proto__, constructor, and returns targetValue': () => {
    const ogVal = {}
    const targetVal = {}

    const result = subject(function og () {}, 'target', 'prototype', ogVal, targetVal)

    assert.equal(result, targetVal)
    assert.equal(targetVal.__proto__, ogVal) // eslint-disable-line
    assert.equal(targetVal.constructor, 'target')
  }
}
