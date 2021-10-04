require('ts-node/register')
globalThis.assert = require('assert')
globalThis.ES_SUPPORT = require('./support/es-support')

var CallLog = require('../src/value/call-log').default
var StubbingRegister = require('../src/value/stubbing-register').default

module.exports = {
  beforeAll: function () {
    require('./support/custom-assertions').default(assert)
  },
  beforeEach: function () {},
  afterEach: function () {
    td.reset()
    td.config.reset()
    CallLog.reset()
    StubbingRegister.reset()
  },
  afterAll: function () {}
}
