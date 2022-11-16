module.exports = function replaceThirdPartyModule () {
  const isNumber = td.replace('is-number')
  const subject = require('../../lib/third-party-thing')
  td.when(isNumber(5)).thenReturn('pants')

  const result = subject(5)

  assert.equal(result, 'pants')
}
