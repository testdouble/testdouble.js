global.td = require('../../..')
global.assert = require('core-assert')

module.exports = {
  afterEach: function () {
    td.reset()
  }
}
