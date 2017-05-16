module.exports = {
  'replaces numbers okay': function () {
    var isNumber = td.replace('is-number')
    var numbersOnly = require('../../lib/numbers-only')
    td.when(isNumber('a string')).thenReturn(true) // tee-hee, this is silly

    var result = numbersOnly('a string')

    assert.equal(result, true)
  }
}
