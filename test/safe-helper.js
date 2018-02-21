require('babel-core/register')({
  presets: ['env']
})
global.assert = require('assert')
global.ES_SUPPORT = require('./support/es-support')
global.td = require('../src/index')

module.exports = {
  beforeAll: function () {
    require('./support/custom-assertions').default(assert)
  },
  afterEach: function () {
    td.reset()
    td.config.reset()
  }
}
