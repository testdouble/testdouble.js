module.exports = {
  'replaces numbers okay': function () {
    const isNumber = td.replace('is-number')
    const numbersOnly = require('../../lib/numbers-only')
    td.when(isNumber('a string')).thenReturn(true) // tee-hee, this is silly

    const result = numbersOnly('a string')

    assert.equal(result, true)
  }
}
