require('babel-core/register')
global.assert = require('core-assert')
global.td = require('testdouble') // <-- a known previous devDep version!!!!
// global.pry = require('pryjs')

module.exports = {
  beforeAll: function () {},
  beforeEach: function () {},
  afterEach: function () {
    td.reset()
  },
  afterAll: function () {}
}
