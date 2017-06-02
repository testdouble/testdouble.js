global.td = require('testdouble')
global.assert = require('core-assert')

module.exports = {
  afterEach: function () {
    td.reset()
  }
}
