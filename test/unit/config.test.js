let log, subject
module.exports = {
  beforeEach: () => {
    log = td.replace('../../src/log').default

    subject = require('../../src/config').default
  },
  'defaults': () => {
    const result = subject()

    assert.deepEqual(result, {
      ignoreWarnings: false,
      promiseConstructor: global.Promise,
      suppressErrors: false
    })
  },
  'overriding an actual property': () => {
    const result = subject({ignoreWarnings: true})

    assert.equal(result.ignoreWarnings, true)
    assert.equal(subject().ignoreWarnings, true)
  },
  'overriding a deprecated property': () => {
    const result = subject({extendWhenReplacingConstructors: true})

    assert.equal(result.extendWhenReplacingConstructors, undefined)
    assert.equal(subject().extendWhenReplacingConstructors, undefined)
    td.verify(log.warn('td.config',
      '"extendWhenReplacingConstructors" is no longer a valid configuration key. Remove it from your calls to td.config() or it may throw an error in the future. For more information, try hunting around our GitHub repo for it:\n\n  https://github.com/testdouble/testdouble.js/search?q=extendWhenReplacingConstructors'
    ))
  },
  'overriding a non-existent property': () => {
    subject({wat: 'wat?'})

    td.verify(log.error('td.config',
      '"wat" is not a valid configuration ' +
      'key (valid keys are: ["ignoreWarnings", ' +
      '"promiseConstructor", "suppressErrors"])'))
  }
}
