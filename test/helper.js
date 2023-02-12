require('ts-node/register')
global.assert = require('assert')
global.ES_SUPPORT = require('./support/es-support')

const CallLog = require('../src/value/call-log').default
const StubbingRegister = require('../src/value/stubbing-register').default

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
