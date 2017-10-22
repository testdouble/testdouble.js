let config, log, subject
module.exports = {
  beforeEach: () => {
    config = td.replace('../../../src/config').default
    log = td.replace('../../../src/log').default

    subject = require('../../../src/log/ensure-promise').default
  },
  'config has no promise set (warn)': () => {
    td.when(config()).thenReturn({promiseConstructor: null})

    subject('warn')

    td.verify(log.warn('td.when', `\
no promise constructor is set, so this \`thenResolve\` or \`thenReject\` stubbing
will fail if it's satisfied by an invocation on the test double. You can tell
testdouble.js which promise constructor to use with \`td.config\`, like so:

  td.config({
    promiseConstructor: require('bluebird')
  })\
`
    ))
  },
  'config has a promise set': () => {
    td.when(config()).thenReturn({promiseConstructor: function () {}})

    subject('warn')

    assert.equal(td.explain(log.warn).callCount, 0)
    assert.equal(td.explain(log.error).callCount, 0)
  },
  'config has no promise set (error level)': () => {
    td.when(config()).thenReturn({promiseConstructor: null})

    subject('error')

    td.verify(log.error('td.when', `\
no promise constructor is set (perhaps this runtime lacks a native Promise
function?), which means this stubbing can't return a promise to your
subject under test, resulting in this error. To resolve the issue, set
a promise constructor with \`td.config\`, like this:

  td.config({
    promiseConstructor: require('bluebird')
  })\
`
    ))
  },

  'config has a promise set (on error level)': () => {
    td.when(config()).thenReturn({promiseConstructor: function () {}})

    subject('error')

    assert.equal(td.explain(log.warn).callCount, 0)
    assert.equal(td.explain(log.error).callCount, 0)
  }
}
