let config, log, subject
module.exports = {
  beforeEach: () => {
    config = td.replace('../../../src/config').default
    log = td.replace('../../../src/log').default

    subject = require('../../../src/when/warn-if-promiseless').default
  },
  'config has no promise set': () => {
    td.when(config()).thenReturn({promiseConstructor: null})

    subject()

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

    subject()

    assert.equal(td.explain(log.warn).callCount, 0)
  }
}
