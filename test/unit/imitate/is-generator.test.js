import subject from '../../../src/imitate/is-generator'

module.exports = {
  'returns false if passed a plain function': () => {
    const func = function () {}

    const result = subject(func)

    assert.strictEqual(result, false)
  },
  'returns true if passed a generator (when generators supported)': () => {
    if (!ES_SUPPORT.GENERATORS) return
    const func = eval('(function* () {})') // eslint-disable-line

    const result = subject(func)

    assert.strictEqual(result, true)
  },
  'returns false when generators are not supported': () => {
    if (ES_SUPPORT.GENERATORS) return
    // Not much of a test, ¯\_(ツ)_/¯
    assert.strictEqual(subject(), false)
  }
}
