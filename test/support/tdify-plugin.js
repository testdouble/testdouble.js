const releaseTd = require('testdouble')
const workingTd = require('../../src/index')

module.exports = {
  name: 'tdify',
  interceptors: {
    test: function (runTest, metadata, cb) {
      if (metadata.ancestorNames[1].indexOf('/test/unit/') !== -1) {
        // Unit test -- `td` is a safe npm release so they can mock!
        globalThis.td = releaseTd
      } else {
        // Safe test -- `td` is the current working copy so we can assert it!
        globalThis.td = workingTd
      }
      runTest(cb)
    }
  }
}
