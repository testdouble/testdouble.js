'use strict'
const test = require('ava')
const td = require('testdouble')

test.afterEach(function (t) {
  td.reset()
})

test('replaces numbers okay', function (t) {
  var isNumber = td.replace('is-number')
  var numbersOnly = require('../../lib/numbers-only')
  td.when(isNumber('a string')).thenReturn(true) // tee-hee, this is silly

  var result = numbersOnly('a string')

  t.is(result, true)
})
