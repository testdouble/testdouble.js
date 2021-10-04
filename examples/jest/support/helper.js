globalThis.td = require('../../..')
globalThis.expect = require('expect')

require('testdouble-jest')(td, jest)

afterEach(function () {
  td.reset()
})
