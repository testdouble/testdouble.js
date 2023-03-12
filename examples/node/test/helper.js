globalThis.td = require('testdouble')
globalThis.assert = require('core-assert')

module.exports = {
  afterEach: function () {
    td.reset()
  }
}
