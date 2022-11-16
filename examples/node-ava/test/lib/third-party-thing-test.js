'use strict'
const test = require('ava')
const td = require('testdouble')

test.beforeEach(function (t) {
  t.context.isNumber = td.replace('is-number')
  t.context.subject = require('../../lib/third-party-thing')
})

test.afterEach(function (t) {
  td.reset()
})

test('third-party-thing', function (t) {
  td.when(t.context.isNumber(5)).thenReturn('pants')

  const result = t.context.subject(5)

  t.is(result, 'pants')
})
