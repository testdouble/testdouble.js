import subject from '../../../src/imitate/initialize-names'

module.exports = {
  'passed a non-null names': () => {
    assert.equal(subject(null, 'foo'), 'foo')
  },
  'an anon function': () => {
    assert.deepEqual(subject(function () {}), [])
  },
  'a named function': () => {
    assert.deepEqual(subject(function blah () {}), ['blah'])
  },
  'a plain object': () => {
    assert.deepEqual(subject({}), [])
  }
}
