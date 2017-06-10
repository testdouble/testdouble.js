require('babel-core/register')({
  presets: ['env', 'babel-preset-power-assert']
})
global.assert = require('power-assert')
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
