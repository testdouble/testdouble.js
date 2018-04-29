import subject from '../../../../src/replace/module/require-actual'

module.exports = {
  'require a relative path' () {
    const thisTestLol = subject('./require-actual.test')

    assert._isEqual(
      thisTestLol['require a relative path'],
      module.exports['require a relative path']
    )
  },
  'require an npm module' () {
    const isNumber = subject('is-number')

    assert._isEqual(isNumber(5), true)
  },
  'print a glorious error when both fail' () {
    // TODO figure out template strings
  }
}
