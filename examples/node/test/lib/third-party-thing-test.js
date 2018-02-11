module.exports = function replaceThirdPartyModule () {
  var isNumber = td.replace('is-number')
  var subject = require('../../lib/third-party-thing')
  td.when(isNumber(5)).thenReturn('pants')

  var result = subject(5)

  assert.equal(result, 'pants')
}
