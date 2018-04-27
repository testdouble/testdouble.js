global.td = require('../../..')
global.expect = require('expect')

require('testdouble-jest')(td, jest)

afterEach(function () {
  td.reset()
})
