'use strict'
const test = require('ava')
const td = require('testdouble')

test.afterEach(function (t) {
  td.reset()
})

test('replaces numbers okay', function (t) {
  const isNumber = td.replace('is-number')
  const numbersOnly = require('../../lib/numbers-only')
  td.when(isNumber('a string')).thenReturn(true) // tee-hee, this is silly

  const result = numbersOnly('a string')

  t.is(result, true)
})
