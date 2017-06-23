require('babel-core/register')({
  presets: ['env', 'babel-preset-power-assert']
})
global.assert = require('power-assert')
global.td = require('testdouble') // <-- a known previous devDep version!!!!
// global.pry = require('pryjs')

var CallLog = require('../src/value/call-log').default
var StubbingRegister = require('../src/value/stubbing-register').default

module.exports = {
  beforeAll: function () {},
  beforeEach: function () {},
  afterEach: function () {
    td.reset()
    CallLog.reset()
    StubbingRegister.reset()
  },
  afterAll: function () {}
}
