describe('numbers-only', function () {
  it('replaces modules ok', function () {
    var isNumber = td.replace('is-number')
    var numbersOnly = require('../../lib/numbers-only')
    td.when(isNumber('a string')).thenReturn(true) // tee-hee, this is silly

    var result = numbersOnly('a string')

    expect(result).to.eq(true)
  })
})
